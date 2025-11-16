package backend.controleestoquevendas.service;

import backend.controleestoquevendas.dto.ItemVendaRequestDTO;
import backend.controleestoquevendas.dto.VendaRequestDTO;
import backend.controleestoquevendas.dto.VendaResponseDTO;
import backend.controleestoquevendas.exception.EstoqueInsuficienteException;
import backend.controleestoquevendas.exception.ResourceNotFoundException;
import backend.controleestoquevendas.model.*;
import backend.controleestoquevendas.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VendaService {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private VendaProdutoRepository vendaProdutoRepository;

    @Transactional
    public Venda criarVenda(VendaRequestDTO vendaDTO, Long vendedorId) {

        Cliente cliente = clienteRepository.findById(vendaDTO.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + vendaDTO.getClienteId()));

        User vendedor = userRepository.findById(vendedorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendedor não encontrado com ID: " + vendedorId));

        Venda venda = new Venda();
        venda.setCliente(cliente);
        venda.setVendedor(vendedor);

        return processarItensDaVenda(venda, vendaDTO.getItens());
    }

    public List<Venda> listarTodasVendas() {
        return vendaRepository.findAll();
    }

    public Optional<Venda> buscarPorId(Long id) {
        return vendaRepository.findById(id);
    }
    @Transactional
    public Page<VendaResponseDTO> listarTodasVendasPaginado(Pageable pageable) {

        Page<Venda> vendasPage = vendaRepository.findAll(pageable);

        return vendasPage.map(VendaResponseDTO::new);
    }

    @Transactional
    public List<VendaResponseDTO> listarVendasPorPeriodo(
            LocalDateTime dataInicial,
            LocalDateTime dataFinal) {

        List<Venda> vendasList = vendaRepository.findByDataVendaBetween(dataInicial, dataFinal);

        return vendasList.stream()
                .map(VendaResponseDTO::new)
                .collect(Collectors.toList());
    }


    public List<Venda> listarVendasPorVendedor(Long vendedorId) {
        return vendaRepository.findByVendedorId(vendedorId);
    }


    @Transactional
    public List<VendaResponseDTO> listarVendasPorCliente(Long clienteId) {

        List<Venda> vendasList = vendaRepository.findByClienteId(clienteId);

        return vendasList.stream()
                .map(VendaResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional // Garante que as relações (Cliente, Vendedor, Itens) sejam carregadas.
    public VendaResponseDTO buscarVendaPorId(Long id) {

        Venda venda = vendaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venda não encontrada com ID: " + id));

        return new VendaResponseDTO(venda);
    }


    public BigDecimal calcularValorTotalVendasPorVendedor(Long vendedorId) {
        List<Venda> vendas = vendaRepository.findByVendedorId(vendedorId);

        return vendas.stream()
                .map(Venda::getValorTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }


    @Transactional
    public Venda atualizarVenda(Long vendaId, VendaRequestDTO vendaDTO, Long vendedorId) {

        Venda vendaExistente = vendaRepository.findById(vendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Venda não encontrada com ID: " + vendaId));

        Cliente novoCliente = clienteRepository.findById(vendaDTO.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + vendaDTO.getClienteId()));

        User vendedor = userRepository.findById(vendedorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendedor não encontrado com ID: " + vendedorId));

        // Mapeia os itens antigos da venda por ID do Produto
        Map<Long, VendaProduto> itensAntigosMap = vendaExistente.getItens().stream()
                .collect(Collectors.toMap(
                        item -> item.getProduto().getId(),
                        item -> item
                ));

        // Lista para armazenar os novos itens de VendaProduto a serem persistidos
        List<VendaProduto> novosItensVenda = new ArrayList<>();
        BigDecimal novoValorTotal = BigDecimal.ZERO;

        // 1. Processa os itens na requisição (vendaDTO)
        for (ItemVendaRequestDTO itemDTO : vendaDTO.getItens()) {

            Produto produto = produtoRepository.findById(itemDTO.getProdutoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com ID: " + itemDTO.getProdutoId()));

            VendaProduto itemOriginal = itensAntigosMap.get(produto.getId());

            int quantidadeAntiga = (itemOriginal != null) ? itemOriginal.getQuantidade() : 0;
            int quantidadeNova = itemDTO.getQuantidade();

            // 2. CALCULA A DIFERENÇA DE ESTOQUE
            // Se o valor for POSITIVO, é a quantidade que precisa ser DEVOLVIDA ao estoque.
            // Se o valor for NEGATIVO, é a quantidade que precisa ser RETIRADA do estoque.
            int ajusteEstoque = quantidadeAntiga - quantidadeNova;

            // 3. VERIFICA ESTOQUE (só é necessário verificar se a quantidade nova for MAIOR que a antiga)
            if (ajusteEstoque < 0) { // Se o ajuste for negativo, significa que a venda aumentou
                // O estoque atual + o ajuste (que é negativo) deve ser >= 0
                if (produto.getQuantidadeEstoque() + ajusteEstoque < 0) {
                    throw new EstoqueInsuficienteException("Estoque insuficiente para o produto: " + produto.getNome());
                }
            }

            // 4. APLICA O AJUSTE E SALVA O PRODUTO
            produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + ajusteEstoque);
            produtoRepository.save(produto); // Persiste a alteração de estoque

            // 5. CRIA O NOVO ITEM DE VENDA
            VendaProduto vendaProduto = new VendaProduto();
            vendaProduto.setVenda(vendaExistente);
            vendaProduto.setProduto(produto);
            vendaProduto.setQuantidade(quantidadeNova);
            vendaProduto.setPrecoUnitario(produto.getPreco());
            vendaProduto.setId(new VendaProdutoId(vendaExistente.getId(), produto.getId()));

            novosItensVenda.add(vendaProduto);
            novoValorTotal = novoValorTotal.add(produto.getPreco().multiply(BigDecimal.valueOf(quantidadeNova)));

            // Remove o item do mapa para saber quais itens foram removidos da venda
            itensAntigosMap.remove(produto.getId());
        }

        // 6. TRATA ITENS REMOVIDOS DA VENDA ORIGINAL
        // Os itens que sobraram no 'itensAntigosMap' foram removidos da vendaDTO
        for (VendaProduto itemRemovido : itensAntigosMap.values()) {
            Produto produto = itemRemovido.getProduto();
            // Devolve a quantidade TOTAL do item removido
            produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + itemRemovido.getQuantidade());
            produtoRepository.save(produto);
        }

        // 7. ATUALIZA A VENDA EXISTENTE
        vendaExistente.setCliente(novoCliente);
        vendaExistente.setVendedor(vendedor);
        vendaExistente.setValorTotal(novoValorTotal);

        // **IMPORTANTE**: Limpa e adiciona os novos itens.
        // Isso garante que o Hibernate/JPA trate a remoção dos itens antigos
        // e a persistência dos novos (Requer @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
        // no campo 'itens' do modelo Venda).
        vendaExistente.getItens().clear();
        vendaExistente.getItens().addAll(novosItensVenda);

        return vendaRepository.save(vendaExistente);
    }


    @Transactional
    public void deletarVenda(Long vendaId, boolean devolverEstoque) {
        Venda venda = vendaRepository.findById(vendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Venda não encontrada com ID: " + vendaId));

        if (devolverEstoque) {
            // Devolve a quantidade ao estoque para cada item da venda
            for (VendaProduto item : venda.getItens()) {
                Produto produto = item.getProduto();
                produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + item.getQuantidade());
                produtoRepository.save(produto);
            }
        }

        // Exclui a venda (os itens de VendaProduto serão excluídos em cascata)
        vendaRepository.delete(venda);
    }

    // metodo AUXILIAR: Processa Itens e Atualiza Estoque
    @Transactional
    protected Venda processarItensDaVenda(Venda venda, List<ItemVendaRequestDTO> itensDTO) {
        List<VendaProduto> itensVenda = new ArrayList<>();
        BigDecimal valorTotal = BigDecimal.ZERO;

        for (ItemVendaRequestDTO itemDTO : itensDTO) {

            Produto produto = produtoRepository.findById(itemDTO.getProdutoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com ID: " + itemDTO.getProdutoId()));

            int quantidade = itemDTO.getQuantidade();
            BigDecimal precoUnitario = produto.getPreco();

            // Validação de Estoque
            if (produto.getQuantidadeEstoque() < quantidade) {
                throw new EstoqueInsuficienteException("Estoque insuficiente para o produto: " + produto.getNome());
            }

            // Cria VendaProduto
            VendaProdutoId vpId = new VendaProdutoId(venda.getId(), produto.getId());
            VendaProduto itemVenda = new VendaProduto();
            itemVenda.setId(vpId);
            itemVenda.setVenda(venda);
            itemVenda.setProduto(produto);
            itemVenda.setQuantidade(quantidade);
            itemVenda.setPrecoUnitario(precoUnitario);

            itensVenda.add(itemVenda);

            // Cálculo e Baixa no Estoque
            BigDecimal subtotal = precoUnitario.multiply(BigDecimal.valueOf(quantidade));
            valorTotal = valorTotal.add(subtotal);

            produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - quantidade);
            produtoRepository.save(produto);
        }

        venda.setItens(itensVenda);
        venda.setValorTotal(valorTotal);

        return vendaRepository.save(venda);
    }
}