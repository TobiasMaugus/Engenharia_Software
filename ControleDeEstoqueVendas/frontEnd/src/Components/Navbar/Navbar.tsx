import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar({ active }: { active: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/";

  if (isLoginPage) return null; // não renderiza na tela de login

  const tabs = [
    { label: "Produtos", path: "/Produtos" },
    { label: "Clientes", path: "/Clientes" },
    { label: "Vendas", path: "/Vendas" },
  ];

  return (
    <nav className="flex bg-[#2d3c3b] text-white">
      {tabs.map((tab) => (
        <div
          key={tab.label}
          onClick={() => navigate(tab.path)}
          className={`flex-1 text-center py-3 cursor-pointer font-semibold transition-colors duration-200 ${
            active === tab.label
              ? "bg-[#d8e3db] text-[#4a5b59]"
              : "bg-[#4a5b59] hover:bg-[#5b6b68]"
          }`}
        >
          {tab.label}
        </div>
      ))}
    </nav>
  );
}