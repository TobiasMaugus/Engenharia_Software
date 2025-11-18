import PageLayout from "../../PageLayout";
import SearchBar from "../../SearchBar";
import DataTable from "../../DataTable";
import Pagination from "../../Pagination";
import { useNavigate } from "react-router-dom";

export default function ProdutoBody() {
  const navigate = useNavigate();
  const vendas = [
    { id: 1, nome: "Martelo", categoria: "Obra", preco: "16,98", quantidade: 8 },
    { id: 2, nome: "Alicate", categoria: "Obra", preco: "10,98", quantidade: 10 },
  ];

  return (
    <PageLayout title="Produtos">
      <SearchBar placeholder="Buscar:" onAdd={() => navigate('/Produtos/CadastrarProduto')} />
      <DataTable
        columns={["ID", "NOME", "CATEGORIA", "PREÇO", "QUANTIDADE", "EDITAR", "EXCLUIR"]}
        data={vendas}
        onEdit={(id) => navigate(`/Produtos/EditarProduto`)}
        onDelete={(id) => navigate(`/Produtos/ExcluirProduto`)}
      />
      <Pagination currentPage={1} totalPages={3} />
    </PageLayout>
  );
}
