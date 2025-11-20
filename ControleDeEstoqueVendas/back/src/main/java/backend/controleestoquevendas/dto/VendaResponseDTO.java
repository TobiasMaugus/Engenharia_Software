package backend.controleestoquevendas.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import backend.controleestoquevendas.model.Venda;
import backend.controleestoquevendas.model.VendaProduto;
import lombok.*;

@Data
public class VendaResponseDTO {

    private Long id;
    private LocalDateTime dataVenda;
    private BigDecimal valorTotal;

    private Long vendedorId;
    private String vendedorNome;
    private Long clienteId;
    private String clienteNome;
    private List<VendaProduto> itens;

    public VendaResponseDTO(Venda venda) {
        this.id = venda.getId();
        this.dataVenda = venda.getDataVenda();
        this.valorTotal = venda.getValorTotal();
        this.itens = venda.getItens();

        // Carrega dados do Vendedor (User)
        if (venda.getVendedor() != null) {
            this.vendedorId = venda.getVendedor().getId();
            this.vendedorNome = venda.getVendedor().getUsername();
        }

        // Carrega dados do Cliente
        if (venda.getCliente() != null) {
            this.clienteId = venda.getCliente().getId();
            this.clienteNome = venda.getCliente().getNome();
        }
    }
}