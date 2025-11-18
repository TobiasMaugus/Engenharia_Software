import CadastroEdicaoForm from "../../CadastroEdicaoForm";

export default function EditarProduto() {
  return (
    <CadastroEdicaoForm
      titulo="Editar Produto"
      tipo="produto"
      modo="editar"
      campos={[
        { label: "Nome", name: "nome", type: "text" },
        { label: "Categoria", name: "categoria", type: "text" },
        { label: "Preço", name: "preco", type: "text" },
        { label: "Estoque", name: "estoque", type: "text" },
      ]}
    />
  );
}
