import { FaTools } from "react-icons/fa";
import { useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  // Renderização Condicional
  if (isLoginPage) {
    return null; // Não renderiza nada se for a página de login
  }

  return (
    <>
    <footer className="w-full bg-[#2d3c3b] text-white text-center px-6 py-3">
      <FaTools className="text-xl" />
    </footer>
    </>
  );
}
