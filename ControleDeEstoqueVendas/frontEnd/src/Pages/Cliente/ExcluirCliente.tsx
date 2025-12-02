import { useLocation, useNavigate } from "react-router-dom";
import ExcluirModal from "../../Components/ModalExcluir.tsx";

export default function ExcluirCliente() {
    const location = useLocation();
    const navigate = useNavigate();

    const cliente = (location.state as any)?.cliente;

    if (!cliente) {
        return (
            <main className="flex-grow flex justify-center items-center bg-[#dce7dd]">
                <div className="bg-[#4E5A58] text-white p-10 rounded-xl text-center space-y-6">
                    <h2 className="text-3xl font-bold">Nenhum cliente foi selecionado</h2>
                    <p className="text-gray-300">Você acessou esta página diretamente.</p>
                    <button
                        id={"back-btn"}
                        onClick={() => navigate("/Clientes")}
                        className="bg-[#3A7A78] px-8 py-3 rounded-lg hover:bg-[#316866]"
                    >
                        Voltar
                    </button>
                </div>
            </main>
        );
    }

    return (
        <ExcluirModal
            tipo="Cliente"
            itemNome={cliente.nome}
        />
    );
}
