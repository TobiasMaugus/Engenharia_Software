import CadastroEdicaoForm from "../../../Components/CadastroEdicaoForm";

export default function CadastrarProduto() {
    return (
        <CadastroEdicaoForm
            titulo="Cadastrar Produto"
            tipo="produto"
            modo="cadastrar"
            campos={[
                { label: "Nome", name: "nome", type: "text" },
                { label: "Categoria", name: "categoria", type: "text" },
                { label: "Preço", name: "preco", type: "number" },
                { label: "Estoque", name: "estoque", type: "number" },
            ]}
        />
    );
}
