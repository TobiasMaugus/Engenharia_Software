import { useLocation } from "react-router-dom";
import CadastroEdicaoForm from "../../Components/CadastroEdicaoForm.tsx";

export default function EditarProduto() {
    const location = useLocation();
    const produto = (location.state as any)?.produto;

    const dadosIniciais = produto
        ? {
            nome: produto.nome,
            categoria: produto.categoria,
            preco: produto.preco,
            estoque: produto.quantidadeEstoque,
        }
        : {};

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
            dadosIniciais={dadosIniciais}
        />
    );
}
