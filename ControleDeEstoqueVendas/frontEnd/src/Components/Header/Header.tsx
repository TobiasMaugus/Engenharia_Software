import { useLocation, useNavigate } from "react-router-dom";
import { getUserFromToken } from "../../api/auth";

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const isLoginPage = location.pathname === "/";

    if (isLoginPage) return null;

    const user = getUserFromToken();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <header className="flex justify-between items-center bg-[#2d3c3b] text-white px-6 py-3">
            <div className="flex items-center space-x-2">
                <h1 id={"user-name"} className="font-bold text-lg">{user?.username}</h1>
                <span id={"user-role"} className="text-[#94b1a0] font-semibold">{user?.role}</span>
            </div>
            <button
                onClick={handleLogout}
                id={"log-out-btn"}
                className="bg-[#b45d44] text-white px-3 py-1 rounded-md hover:bg-[#c76a50] transition-colors"
            >
                Log-out
            </button>
        </header>
    );
}
