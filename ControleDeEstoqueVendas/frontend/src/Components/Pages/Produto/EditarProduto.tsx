import { useLocation } from "react-router-dom";
import CadastroEdicaoForm from "../../CadastroEdicaoForm";

export default function EditarProduto() {
    const location = useLocation();
    // location.state?.produto vem do navigate(...) feito no ProdutoBody
    const produto = (location.state as any)?.produto;

    // Se produto existe no state, passamos seus valores como dadosIniciais.
    // Mantemos strings para os inputs (se seu form espera isso) ou números conforme seu form.
    const dadosIniciais = produto
        ? {
            nome: produto.nome,
            categoria: produto.categoria,
            // dependendo do seu CadastroEdicaoForm:
            // se ele trata preco/estoque como number, passe number; se espera string, passe string.
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
