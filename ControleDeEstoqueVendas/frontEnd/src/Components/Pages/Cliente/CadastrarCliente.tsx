import CadastroEdicaoForm from "../../CadastroEdicaoForm";

export default function CadastrarCliente() {
  return (
    <CadastroEdicaoForm
      titulo="Cadastrar Cliente"
      tipo="cliente"
      modo="cadastrar"
      campos={[
        { label: "Nome", name: "nome", type: "text" },
        { label: "Telefone", name: "telefone", type: "text" },
        { label: "Endereço", name: "endereco", type: "text" },
      ]}
    />
  );
}
