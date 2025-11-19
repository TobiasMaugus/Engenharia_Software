import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/";

  // 1. Se for a página de login, não renderiza o Header
  if (isLoginPage) {
    return null;
  }

  // 2. Função de logout
  const handleLogout = () => {
    // Aqui você poderia limpar o estado de autenticação se tiver (ex: localStorage)
    navigate("/"); // redireciona para a tela de login
  };

  return (
    <header className="flex justify-between items-center bg-[#2d3c3b] text-white px-6 py-3">
      <div className="flex items-center space-x-2">
        <h1 className="font-bold text-lg">João Afonso</h1>
        <span className="text-[#94b1a0] font-semibold">Gerente</span>
      </div>
      <button
        onClick={handleLogout}
        className="bg-[#b45d44] text-white px-3 py-1 rounded-md hover:bg-[#c76a50] transition-colors"
      >
        Log-out
      </button>
    </header>
  );
}
