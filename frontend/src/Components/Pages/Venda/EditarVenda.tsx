import CadastroEdicaoForm from "../../CadastroEdicaoForm";

export default function EditarVenda() {
  return (
    <CadastroEdicaoForm
      titulo="Editar Venda"
      tipo="venda"
      modo="editar"
      campos={[
        { label: "Vendedor", name: "vendedor", type: "text" },
        { label: "Cliente", name: "cliente", type: "text" },
        { label: "Data da Venda", name: "data", type: "date" },
      ]}
    />
  );
}
