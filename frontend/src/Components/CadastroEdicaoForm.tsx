import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SearchBar from "./SearchBar";
import DataTable from "./DataTable";
import Pagination from "./Pagination";

interface Campo {
  label: string;
  name: string;
  type: string;
  options?: string[];
}

interface Props {
  titulo: string;
  tipo: "produto" | "cliente" | "venda";
  modo: "cadastrar" | "editar" | "view";     // <<< NOVO
  campos: Campo[];
}

export default function CadastroEdicaoForm({ titulo, tipo, modo, campos }: Props) {
  const navigate = useNavigate();

  const somenteLeitura = modo === "view";

  // ------------------------------
  // FORM PRINCIPAL
  // ------------------------------
  const [formData, setFormData] = useState<Record<string, string>>({});

  function handleChange(name: string, value: string) {
    if (somenteLeitura) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // ------------------------------
  // SISTEMA DE PRODUTOS (só vendas)
  // ------------------------------

  const [produtos] = useState([
    { id: 1, nome: "Martelo", preco: 20.5 },
    { id: 2, nome: "Alicate", preco: 15.9 },
    { id: 3, nome: "Parafuso", preco: 0.5 },
  ]);

  const [itens, setItens] = useState<
    { id: number; nome: string; preco: number; quantidade: number }[]
  >([]);

  const [page, setPage] = useState(1);
  const itensPerPage = 5;

  const totalPages = Math.ceil(itens.length / itensPerPage);
  const itensPaginados = itens.slice(
    (page - 1) * itensPerPage,
    page * itensPerPage
  );

  function adicionarProdutoAleatorio() {
    if (somenteLeitura) return;
    const aleatorio = produtos[Math.floor(Math.random() * produtos.length)];
    setItens((prev) => [...prev, { ...aleatorio, quantidade: 1 }]);
  }

  function editarQuantidade(id: number, qtd: number) {
    if (somenteLeitura) return;
    setItens((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantidade: qtd } : i))
    );
  }

  function removerItem(id: number) {
    if (somenteLeitura) return;
    setItens((prev) => prev.filter((i) => i.id !== id));
  }

  // ------------------------------
  // SUBMIT
  // ------------------------------
  function salvar() {
    alert("Salvo com sucesso!");
    navigate(-1);
  }

  return (
    <div className="bg-[#E0ECE4] flex justify-center items-center h-screen">
      <div className="bg-[#4E5A58] text-white w-[80%] max-w-3xl rounded-2xl p-10 shadow-lg relative">

        {/* TÍTULO */}
        <h2 className="text-2xl font-bold mb-6">
          {titulo}
        </h2>

        {/* VOLTAR */}
        <button
          onClick={() => navigate(-1)}
          className="absolute right-8 top-8 bg-[#8EB9AE] p-2 rounded-md hover:bg-[#7aa59b] transition"
        >
          <ArrowLeft className="text-white" />
        </button>

        {/* FORM */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!somenteLeitura) salvar();
          }}
          className="flex flex-col gap-5"
        >
          {campos.map((campo) => (
            <div key={campo.name} className="flex flex-col">
              {campo.type === "select" ? (
                <select
                  name={campo.name}
                  disabled={somenteLeitura}
                  onChange={(e) => handleChange(campo.name, e.target.value)}
                  className="bg-[#357F7D] text-white px-4 py-2 rounded-md disabled:opacity-60"
                >
                  <option value="">Selecione...</option>
                  {campo.options?.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name={campo.name}
                  type={campo.type}
                  disabled={somenteLeitura}
                  onChange={(e) => handleChange(campo.name, e.target.value)}
                  placeholder={campo.label}
                  className="bg-[#357F7D] text-white placeholder-gray-200 px-4 py-2 rounded-md disabled:opacity-60"
                />
              )}
            </div>
          ))}

          {/* ----------------------
              ÁREA DE PRODUTOS (SÓ VENDAS)
              ---------------------- */}
          {tipo === "venda" && (
            <>
              <h2 className="text-[#E0ECE4] text-xl font-bold mt-10 mb-4">
                Produtos da Venda
              </h2>

              {/* SearchBar só aparece em cadastrar/editar */}
              {modo !== "view" && (
                <SearchBar
                  placeholder="Buscar produtos..."
                  onAdd={adicionarProdutoAleatorio}
                />
              )}

              <DataTable
                columns={
                  modo === "view"
                    ? ["ID", "PRODUTO", "PREÇO", "QUANTIDADE"]
                    : ["ID", "PRODUTO", "PREÇO", "QUANTIDADE", "EXCLUIR"]
                }
                data={itensPaginados.map((i) => ({
                  id: i.id,
                  nome: i.nome,
                  preco: `R$ ${i.preco.toFixed(2)}`,
                  qtd:
                    modo === "view" ? (
                      i.quantidade
                    ) : (
                      <input
                        type="number"
                        className="w-16 bg-[#357F7D] text-white px-2 py-1 rounded-md"
                        value={i.quantidade}
                        onChange={(e) =>
                          editarQuantidade(i.id, Number(e.target.value))
                        }
                      />
                    ),
                }))}
                onDelete={modo !== "view" ? removerItem : undefined}
              />

              <Pagination
                currentPage={1}
                totalPages={3}
              />
            </>
          )}

          {/* BOTÃO SALVAR some no modo view */}
          {modo !== "view" && (
            <button
              type="submit"
              className="bg-[#8EB9AE] text-white font-bold text-lg px-10 py-3 mt-6 rounded-md hover:bg-[#7aa59b]"
            >
              SALVAR
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
