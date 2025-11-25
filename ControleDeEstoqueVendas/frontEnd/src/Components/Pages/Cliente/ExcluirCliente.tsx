import { useLocation } from "react-router-dom";
import ExcluirModal from "../../ModalExcluir";

export default function ExcluirCliente() {
  const location = useLocation();
  const cliente = (location.state as any)?.cliente;

  return (
      <ExcluirModal
          tipo="Cliente"
          itemNome={cliente?.nome ?? "Cliente"}
      />
  );
}
