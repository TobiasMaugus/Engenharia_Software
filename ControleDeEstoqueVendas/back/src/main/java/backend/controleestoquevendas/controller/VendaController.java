package backend.controleestoquevendas.controller;

import backend.controleestoquevendas.dto.VendaRequestDTO;
import backend.controleestoquevendas.dto.VendaResponseDTO;
import backend.controleestoquevendas.exception.EstoqueInsuficienteException;
import backend.controleestoquevendas.exception.ResourceNotFoundException;
import backend.controleestoquevendas.model.User;
import backend.controleestoquevendas.model.Venda;
import backend.controleestoquevendas.repository.UserRepository;
import backend.controleestoquevendas.service.VendaService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Pageable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/vendas")
public class VendaController {

    @Autowired
    private VendaService vendaService;

    @Autowired
    UserRepository userRepository;

    private Map<String, String> formatarErros(BindingResult bindingResult) {
        return bindingResult.getFieldErrors().stream()
                .collect(Collectors.toMap(
                        // Chave: Nome do campo com erro (ex: "nome", "cpf", "quantidade")
                        fieldError -> fieldError.getField(),

                        // Valor: Mensagem de erro
                        fieldError -> fieldError.getDefaultMessage(),

                        // Merger (caso um campo tenha múltiplas anotações que falharam):
                        // Mantém a primeira mensagem de erro encontrada.
                        (existing, replacement) -> existing
                ));
    }

    @PostMapping
    public ResponseEntity<?> criarVenda(@RequestBody @Valid VendaRequestDTO vendaDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(formatarErros(bindingResult));
        }
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();

            // Busca o ID no banco
            User user = userRepository.findByUsername(username).orElseThrow();
            Long vendedorId = user.getId();

            Venda novaVenda = vendaService.criarVenda(vendaDTO, vendedorId);
            return ResponseEntity.status(HttpStatus.CREATED).body(novaVenda);
        } catch (EstoqueInsuficienteException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping // Rota base: /vendas?page=0&size=10
    public Page<VendaResponseDTO> listarTodasVendasPaginado(
            // Define o Pageable: page=0 (página inicial), size=10 (10 itens por página), sort=dataVenda,desc
            @PageableDefault(page = 0, size = 10, sort = "dataVenda", direction = Sort.Direction.DESC)
            Pageable pageable) {

        return vendaService.listarTodasVendasPaginado((org.springframework.data.domain.Pageable) pageable);
    }

    @GetMapping("/periodo")
    public List<VendaResponseDTO> listarVendasPorPeriodo(
            @RequestParam("dataInicial")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) // Ex: 2025-01-01T00:00:00
            LocalDateTime dataInicial,

            @RequestParam("dataFinal")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime dataFinal) {

        return vendaService.listarVendasPorPeriodo(dataInicial, dataFinal);
    }

    // LER SOMENTE VENDAS DO VENDEDOR LOGADO
    @GetMapping("/meus")
    public List<Venda> listarMinhasVendas() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        return vendaService.listarVendasPorVendedor(user.getId());
    }


    // LER VENDAS DE UM CLIENTE ESPECÍFICO
    @GetMapping("/cliente/{clienteId}")
    public List<VendaResponseDTO> listarVendasPorCliente(@PathVariable Long clienteId) {

        List<VendaResponseDTO> vendas = vendaService.listarVendasPorCliente(clienteId);
        return vendaService.listarVendasPorCliente(clienteId);

    }

    @GetMapping("/{id}")
    public ResponseEntity<VendaResponseDTO> buscarVendaPorId(@PathVariable Long id) {
        try {
            VendaResponseDTO vendaDTO = vendaService.buscarVendaPorId(id);
            return ResponseEntity.ok(vendaDTO);

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/total/meu")
    public ResponseEntity<BigDecimal> valorTotalMinhasVendas() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        BigDecimal total = vendaService.calcularValorTotalVendasPorVendedor(user.getId());
        return ResponseEntity.ok(total);
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarVenda(
            @PathVariable Long id,
            @RequestBody @Valid VendaRequestDTO vendaDTO,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(formatarErros(bindingResult));
        }
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            User user = userRepository.findByUsername(username).orElseThrow();

            Venda vendaAtualizada = vendaService.atualizarVenda(id, vendaDTO, user.getId());
            return ResponseEntity.ok(vendaAtualizada);

        } catch (ResourceNotFoundException e) {
            // Trata Venda, Cliente ou Produto não encontrado (404)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));

        } catch (EstoqueInsuficienteException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Falha na atualização da venda: " + e.getMessage()));
        }
    }


    // EXCLUIR UMA VENDA (com opção de devolver estoque)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarVenda(
            @PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean devolverEstoque
    ) {
        try {
            vendaService.deletarVenda(id, devolverEstoque);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}