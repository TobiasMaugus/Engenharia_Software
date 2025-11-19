import CadastroEdicaoForm from "../../CadastroEdicaoForm";

export default function EditarCliente() {
  return (
    <CadastroEdicaoForm
      titulo="Editar Cliente"
      tipo="cliente"
      modo="editar"
      campos={[
        { label: "Nome", name: "nome", type: "text" },
        { label: "Telefone", name: "telefone", type: "text" },
        { label: "Endereço", name: "endereco", type: "text" },
      ]}
    />
  );
}
