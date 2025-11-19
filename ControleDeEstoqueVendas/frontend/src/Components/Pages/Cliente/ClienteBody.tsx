import PageLayout from "../../PageLayout";
import SearchBar from "../../SearchBar";
import DataTable from "../../DataTable";
import Pagination from "../../Pagination";
import { useNavigate } from "react-router-dom";

export default function ClienteBody() {
  const navigate = useNavigate();
  const clientes = [
    { id: 1, nome: "Thaís Lopes", telefone: "(35) 99940-0839", cpf: "167.876.126-99"},
    { id: 2, nome: "Kenny Turola", telefone: "(35) 99942-5883", cpf: "168.086.876-99"},
  ];

  return (
    <PageLayout title="Clientes">
      <SearchBar placeholder="Buscar:" onAdd={() => navigate('/Clientes/CadastrarCliente')} />
      <DataTable
        columns={["ID", "NOME", "TELEFONE", "CPF", "EDITAR", "EXCLUIR"]}
        data={clientes}
        onEdit={(id) => navigate(`/Clientes/EditarCliente`)}
        onDelete={(id) => navigate(`/Clientes/ExcluirCliente`)}
      />
      <Pagination currentPage={1} totalPages={3} />
    </PageLayout>
  );
}
