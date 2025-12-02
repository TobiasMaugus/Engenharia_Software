import { useLocation } from "react-router-dom";
import ExcluirModal from "../../Components/ModalExcluir.tsx";

export default function ExcluirProduto() {
    const location = useLocation();
    const produto = (location.state as any)?.produto;

    return (
        <ExcluirModal
            tipo="Produto"
            itemNome={produto?.nome ?? "Produto"}
            onCancel={() => window.history.back()}
            onConfirm={() => {
                // Você pode colocar exclusão aqui se quiser manter essa rota
                window.history.back();
            }}
        />
    );
}
