package backend.controleestoquevendas.repository;

import backend.controleestoquevendas.model.VendaProduto;
import backend.controleestoquevendas.model.VendaProdutoId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VendaProdutoRepository extends JpaRepository<VendaProduto, VendaProdutoId> {
}