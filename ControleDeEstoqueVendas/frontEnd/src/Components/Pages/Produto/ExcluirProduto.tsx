import { useLocation } from "react-router-dom";
import ExcluirModal from "../../ModalExcluir";

export default function ExcluirProduto() {
  const location = useLocation();
  const produto = (location.state as any)?.produto;

  return (
      <ExcluirModal
          tipo="Produto"
          itemNome={produto?.nome ?? "Produto"}
      />
  );
}
