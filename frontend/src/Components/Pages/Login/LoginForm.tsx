import { FaUser, FaKey, FaTools } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Aqui você poderia validar o login (ex: checar usuário/senha)
    navigate("/Vendas"); // Redireciona para a tela de Vendas
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#dce7dd]">
      <div className="bg-[#2d3c3b] rounded-xl shadow-lg p-10 w-96 flex flex-col items-center">
        <FaTools className="text-white text-5xl mb-4" />
        <h1 className="text-white text-3xl font-light mb-8">Login</h1>

        <div className="w-full space-y-4">
          <div className="flex items-center bg-[#9aa79b] rounded-md px-3 py-2">
            <FaUser className="text-[#2d3c3b] mr-3 text-lg" />
            <input
              type="text"
              placeholder="Usuário"
              className="bg-transparent focus:outline-none text-white placeholder-white w-full"
            />
          </div>

          <div className="flex items-center bg-[#9aa79b] rounded-md px-3 py-2">
            <FaKey className="text-[#2d3c3b] mr-3 text-lg" />
            <input
              type="password"
              placeholder="Senha"
              className="bg-transparent focus:outline-none text-white placeholder-white w-full"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-[#9aa79b] text-[#2d3c3b] py-2 rounded-md font-medium hover:bg-[#b4bfb3] transition-colors"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}
