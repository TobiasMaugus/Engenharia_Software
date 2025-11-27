import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Formulario from "./Form";

interface Campo {
  label: string;
  name: string;
  type: string;
  options?: string[];
  readOnly?: boolean;
}

interface Props {
  titulo: string;
  tipo: "produto" | "cliente" | "venda";
  modo: "cadastrar" | "editar" | "view";
  campos: Campo[];
  dadosIniciais?: Record<string, any>;
}

export default function CadastroEdicaoForm({
                                             titulo,
                                             tipo,
                                             modo,
                                             campos,
                                             dadosIniciais = {},
                                           }: Props) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const somenteLeitura = modo === "view";

  const [formData, setFormData] = useState(dadosIniciais);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    async function carregarDados() {
      if (modo !== "editar" || !id || tipo !== "produto") return;

      try {
        const { listarProdutoPorId } = await import("../api/produtoService");
        const p = await listarProdutoPorId(Number(id));

        setFormData({
          nome: p.nome,
          categoria: p.categoria,
          preco: p.preco,
          estoque: p.quantidadeEstoque,
        });
      } catch (e) {
        console.error("Erro ao carregar item:", e);
      }
    }

    carregarDados();
  }, [modo, id, tipo]);


  function handleChange(name: string, value: string | number) {
    if (somenteLeitura) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }


  async function salvarProduto() {
    const payload = {
      nome: String(formData.nome),
      categoria: String(formData.categoria),
      preco: Number(formData.preco),
      quantidadeEstoque: Number(formData.estoque),
    };

    if (modo === "cadastrar") {
      const { criarProduto } = await import("../api/produtoService");
      await criarProduto(payload);
    } else if (modo === "editar" && id) {
      const { editarProduto } = await import("../api/produtoService");
      await editarProduto(Number(id), payload);
    }
  }

  async function salvarCliente() {
    const payload = {
      nome: String(formData.nome),
      telefone: String(formData.telefone),
      cpf: String(formData.cpf),
    };

    if (modo === "cadastrar") {
      const { criarCliente } = await import("../api/clienteService");
      await criarCliente(payload);
    } else if (modo === "editar" && id) {
      const { editarCliente } = await import("../api/clienteService");
      await editarCliente(Number(id), payload);
    }
  }

  async function salvarVenda() {
    const clienteIdRaw = formData.clienteId;

    const clienteId = Number(
        typeof clienteIdRaw === "string"
            ? clienteIdRaw.split(" - ")[0]
            : clienteIdRaw
    );

    const payload = {
      clienteId,
      itens: formData.itens.map((i: any) => ({
        produtoId: Number(
            typeof i.produtoId === "string"
                ? i.produtoId.split(" - ")[0]
                : i.produtoId
        ),
        quantidade: Number(i.quantidade),
      })),
    };

    if (modo === "cadastrar") {
      const { criarVenda } = await import("../api/vendaService");
      await criarVenda(payload);
    } else if (modo === "editar" && id) {
      const { editarVenda } = await import("../api/vendaService");
      await editarVenda(Number(id), payload);
    }
  }




  async function salvar() {
    setLoading(true);

    try {
      if (tipo === "produto") {
        await salvarProduto();
      } else if (tipo === "cliente") {
        await salvarCliente();
      } else if (tipo === "venda") {
        await salvarVenda();
      }

      alert("Salvo com sucesso!");
      navigate(-1);
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
          <h2 className="text-2xl font-bold mb-6">{titulo}</h2>

          <button
              onClick={() => navigate(-1)}
              className="absolute right-8 top-8 bg-[#8EB9AE] p-2 rounded-md hover:bg-[#7aa59b] transition"
          >
            <ArrowLeft className="text-white" />
          </button>

          <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!somenteLeitura) salvar();
              }}
              className="flex flex-col gap-5"
          >
            <Formulario
                campos={campos}
                dadosIniciais={formData}
                somenteLeitura={somenteLeitura}
                onChange={setFormData}
            />

            {modo !== "view" && (
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#8EB9AE] text-white font-bold text-lg px-10 py-3 mt-6 rounded-md hover:bg-[#7aa59b]"
                >
                  {loading ? "Salvando..." : "SALVAR"}
                </button>
            )}
          </form>
        </div>
      </div>
  );
}
