import { useNavigate } from "react-router-dom";

interface ExcluirModalProps {
  itemNome: string;
  tipo: "Produto" | "Cliente" | "Venda";
  onConfirm?: () => void;
  onCancel?: () => void;
}

export default function ExcluirModal({ itemNome, tipo, onConfirm, onCancel }: ExcluirModalProps) {
  const navigate = useNavigate();

  function handleCancel() {
    if (onCancel) onCancel();
    else navigate(`/${tipo}s`); // Ex: /Produtos, /Clientes, /Vendas
  }

  function handleConfirm() {
    if (onConfirm) onConfirm();
    // Aqui você poderia colocar uma requisição DELETE, por exemplo.
    navigate(`/${tipo}s`);
  }

  return (
    <main className="flex-grow flex justify-center items-center bg-[#dce7dd]">
      <div className="bg-[#4E5A58] text-white w-[80%] max-w-3xl rounded-2xl p-10 shadow-lg flex flex-col items-center text-center space-y-8">
        <h2 className="text-4xl font-extrabold tracking-wide">EXCLUIR {tipo.toUpperCase()}</h2>

        <div>
          <p className="text-2xl font-semibold mb-2">
            Deseja excluir <span className="text-[#94b1a0]">{itemNome}</span>?
          </p>
          <p className="text-sm text-gray-300">Essa ação não pode ser desfeita</p>
        </div>

        <div className="flex gap-10 mt-6">
          <button
            onClick={handleConfirm}
            className="bg-[#A5563D] text-white text-lg font-semibold px-10 py-3 rounded-md hover:bg-[#8d4632] transition"
          >
            Sim
          </button>
          <button
            onClick={handleCancel}
            className="bg-[#3A7A78] text-white text-lg font-semibold px-10 py-3 rounded-md hover:bg-[#316866] transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </main>
  );
}
