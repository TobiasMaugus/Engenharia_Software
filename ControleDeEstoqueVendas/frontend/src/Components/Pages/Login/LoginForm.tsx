import { FaUser, FaKey, FaTools } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginRequest } from "../../../api/auth";

export default function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [erro, setErro] = useState<string>("");

    const handleLogin = async () => {
        const result = await loginRequest(username, password);

        if (!result.success) {
            setErro(result.message);
            return;
        }

        // Login bem-sucedido: o token SEMPRE existe (tipo seguro)
        localStorage.setItem("token", result.token);

        navigate("/Vendas");
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
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-transparent focus:outline-none text-white placeholder-white w-full"
                        />
                    </div>

                    <div className="flex items-center bg-[#9aa79b] rounded-md px-3 py-2">
                        <FaKey className="text-[#2d3c3b] mr-3 text-lg" />
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-transparent focus:outline-none text-white placeholder-white w-full"
                        />
                    </div>

                    {erro && (
                        <p className="text-red-300 text-sm text-center">{erro}</p>
                    )}

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
