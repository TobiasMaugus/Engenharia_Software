import CadastroEdicaoForm from "../../CadastroEdicaoForm";

export default function CadastrarVenda() {
  return (
    <CadastroEdicaoForm
      titulo="Cadastrar Venda"
      tipo="venda"
      modo="cadastrar"
      campos={[
        { label: "Vendedor", name: "vendedor", type: "text" },
        { label: "Cliente", name: "cliente", type: "text" },
        { label: "Data da Venda", name: "data", type: "date" },
      ]}
    />
  );
}
