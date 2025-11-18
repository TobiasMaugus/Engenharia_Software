import PageLayout from "../../PageLayout";
import SearchBar from "../../SearchBar";
import DataTable from "../../DataTable";
import Pagination from "../../Pagination";
import { useNavigate } from "react-router-dom";

export default function VendaBody() {
  const navigate = useNavigate();

  const vendas = [
    { id: 1, vendedor: "Carlos", cliente: "Ana", valor: "230,00", data: "12/10/2024" },
    { id: 2, vendedor: "João", cliente: "Pedro", valor: "150,00", data: "14/10/2024" },
  ];

  return (
    <PageLayout title="Vendas">
      <SearchBar
        placeholder="Buscar:"
        onAdd={() => navigate("/Vendas/CadastrarVenda")}
      />

      <DataTable
        columns={["ID","VENDEDOR","CLIENTE","VALOR","DATA","DETALHES","EDITAR","EXCLUIR",]}
        data={vendas}
        onView={(id) => navigate(`/Vendas/VisualizarVenda`)}
        onEdit={(id) => navigate(`/Vendas/EditarVenda`)}
        onDelete={(id) => navigate(`/Vendas/ExcluirVenda`)}
      />

      <Pagination currentPage={1} totalPages={3} />
    </PageLayout>
  );
}