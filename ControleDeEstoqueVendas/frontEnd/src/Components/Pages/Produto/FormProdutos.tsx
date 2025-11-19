import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Formulario from "../../Form";
import { criarProduto, editarProduto, listarProdutos } from "../../../api/produtoService";

export default function FormProduto({ modo }: { modo: "cadastrar" | "editar" }) {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [formData, setFormData] = useState({
        nome: "",
        categoria: "",
        preco: 0,
        estoque: 0,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (modo === "editar" && id) {
            listarProdutos().then((produtos) => {
                const p = produtos.find((p) => p.id === Number(id));
                if (p) {
                    setFormData({
                        nome: p.nome,
                        categoria: p.categoria,
                        preco: p.preco,
                        estoque: p.quantidadeEstoque,
                    });
                }
            });
        }
    }, [modo, id]);

    async function salvar() {
        setLoading(true);
        try {
            const { nome, categoria, preco, estoque } = formData;

            if (!nome || !categoria || preco === undefined || estoque === undefined) {
                alert("Preencha todos os campos corretamente!");
                setLoading(false);
                return;
            }

            const payload = {
                nome,
                categoria,
                preco: Number(preco),
                quantidade: Number(estoque),
            };

            if (modo === "cadastrar") {
                await criarProduto(payload);
            } else if (modo === "editar" && id) {
                await editarProduto(Number(id), payload);
            }

            alert("Salvo com sucesso!");
            navigate("/Produtos");
        } catch (err) {
            console.error(err);
            alert("Erro ao salvar. Veja o console.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-[#E0ECE4] flex justify-center items-center h-screen">
            <div className="bg-[#4E5A58] text-white w-[80%] max-w-3xl rounded-2xl p-10 shadow-lg relative">
                <h2 className="text-2xl font-bold mb-6">
                    {modo === "cadastrar" ? "Cadastrar Produto" : "Editar Produto"}
                </h2>

                <Formulario
                    campos={[
                        { label: "Nome", name: "nome", type: "text" },
                        { label: "Categoria", name: "categoria", type: "text" },
                        { label: "Preço", name: "preco", type: "number" },
                        { label: "Estoque", name: "estoque", type: "number" },
                    ]}
                    dadosIniciais={formData}
                    onChange={(f) => setFormData(f)}
                />

                <button
                    onClick={salvar}
                    disabled={loading}
                    className="bg-[#8EB9AE] text-white font-bold text-lg px-10 py-3 mt-6 rounded-md hover:bg-[#7aa59b]"
                >
                    {loading ? "Salvando..." : "SALVAR"}
                </button>
            </div>
        </div>
    );
}
