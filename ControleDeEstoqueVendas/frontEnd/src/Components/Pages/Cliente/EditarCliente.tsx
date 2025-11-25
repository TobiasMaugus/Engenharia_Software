import { useLocation } from "react-router-dom";
import CadastroEdicaoForm from "../../CadastroEdicaoForm";

export default function EditarCliente() {
    const location = useLocation();
    const cliente = (location.state as any)?.cliente;

    const dadosIniciais = cliente
        ? {
            nome: cliente.nome,
            telefone: cliente.telefone,
            cpf: cliente.cpf,
        }
        : {};

    return (
        <CadastroEdicaoForm
            titulo="Editar Cliente"
            tipo="cliente"
            modo="editar"
            campos={[
                { label: "Nome", name: "nome", type: "text" },
                { label: "Telefone", name: "telefone", type: "text" },
                { label: "CPF", name: "cpf", type: "text", readOnly: true }, // <-- aqui
            ]}
            dadosIniciais={dadosIniciais}
        />
    );
}
