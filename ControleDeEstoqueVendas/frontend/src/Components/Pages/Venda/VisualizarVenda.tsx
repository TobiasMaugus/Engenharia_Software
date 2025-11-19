import CadastroEdicaoForm from "../../CadastroEdicaoForm";

export default function VisualizarVenda() {
  return (
    <CadastroEdicaoForm
      titulo="Detalhes da Venda"
      tipo="venda"
      modo="view"
      campos={[
        { label: "Vendedor", name: "vendedor", type: "text" },
        { label: "Cliente", name: "cliente", type: "text" },
        { label: "Data da Venda", name: "data", type: "date" },
      ]}
    />
  );
}
