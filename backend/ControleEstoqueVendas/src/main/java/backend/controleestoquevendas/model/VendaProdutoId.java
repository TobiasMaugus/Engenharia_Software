package backend.controleestoquevendas.model;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable //classe incorporável
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendaProdutoId implements Serializable {

    // ID em Venda (Long)
    private Long vendaId;

    // ID em Produto (Long)
    private Long produtoId;
}