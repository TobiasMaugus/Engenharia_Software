import CadastroEdicaoForm from "../../Components/CadastroEdicaoForm.tsx";

export default function CadastrarCliente() {
    return (
        <CadastroEdicaoForm
            titulo="Cadastrar Cliente"
            tipo="cliente"
            modo="cadastrar"
            campos={[
                { label: "Nome", name: "nome", type: "text" },
                { label: "Telefone", name: "telefone", type: "text" },
                { label: "CPF", name: "cpf", type: "text" },
            ]}
        />
    );
}
