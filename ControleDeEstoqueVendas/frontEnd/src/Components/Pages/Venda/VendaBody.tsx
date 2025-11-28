import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageLayout from "../../PageLayout";
import SearchBar from "../../SearchBar";
import DataTable from "../../DataTable";
import Pagination from "../../Pagination";

import { listarVendas, excluirVenda } from "../../../api/vendaService";
import type { Venda } from "../../../types/Venda";

import { getUserFromToken } from "../../../api/auth";
import ExcluirVenda from "./ExcluirVenda"; // ✅ import do modal

export default function VendaBody() {
    const navigate = useNavigate();
    const user = getUserFromToken();
    const isGerente = user?.role === "GERENTE";

    const [vendas, setVendas] = useState<Venda[]>([]);
    const [allVendas, setAllVendas] = useState<Venda[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [dataInicial, setDataInicial] = useState("");
    const [dataFinal, setDataFinal] = useState("");

    // ✅ novo estado para o modal
    const [vendaParaExcluir, setVendaParaExcluir] = useState<Venda | null>(null);

    useEffect(() => {
        async function carregar() {
            try {
                const page = await listarVendas(currentPage);

                setVendas(page.content);
                setAllVendas(page.content);
                setTotalPages(page.totalPages);
            } catch (error) {
                console.error("Erro ao carregar vendas:", error);
            }
        }

        carregar();
    }, [currentPage]);

    function handleSearch(term: string) {
        const q = (term || "").trim().toLowerCase();

        if (!q) {
            aplicarFiltroData(allVendas);
            return;
        }

        const filtrados = allVendas.filter((v) => {
            const id = v.id?.toString() ?? "";
            const vendedor = (v.vendedorNome ?? "").toLowerCase();
            const cliente = (v.clienteNome ?? "").toLowerCase();

            return id.includes(q) || vendedor.includes(q) || cliente.includes(q);
        });

        aplicarFiltroData(filtrados);
    }

    function parseBR(d: string) {
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(d)) return null;
        const [dia, mes, ano] = d.split("/");
        return new Date(`${ano}-${mes}-${dia}T00:00:00`).getTime();
    }

    function aplicarFiltroData(listaBase: Venda[]) {
        const ini = parseBR(dataInicial);
        let fim = parseBR(dataFinal);

        if (fim !== null) {
            fim = fim + (24 * 60 * 60 * 1000 - 1);
        }

        if (ini === null && fim === null) {
            setVendas(listaBase);
            return;
        }

        const filtrados = listaBase.filter((v) => {
            if (!v.dataVenda) return false;

            const d = new Date(v.dataVenda).getTime();

            return (ini === null || d >= ini) && (fim === null || d <= fim);
        });

        setVendas(filtrados);
    }

    useEffect(() => {
        aplicarFiltroData(allVendas);
    }, [dataInicial, dataFinal]);

    // ✅ função para confirmar exclusão via modal
    async function handleConfirmDelete() {
        if (!vendaParaExcluir) return;

        try {
            await excluirVenda(vendaParaExcluir.id);

            const novaLista = vendas.filter((v) => v.id !== vendaParaExcluir.id);
            setVendas(novaLista);
            setAllVendas(novaLista);
            setVendaParaExcluir(null);
        } catch (error) {
            console.error("Erro ao excluir:", error);
        }
    }

    // Colunas condicionais
    const columns = ["ID", "VENDEDOR", "CLIENTE", "VALOR", "DATA", "DETALHES"];
    if (isGerente) {
        columns.push("EDITAR", "EXCLUIR");
    }

    return (
        <PageLayout title="Vendas">
            <div style={{ marginBottom: "10px" }}>
                <SearchBar
                    placeholder="Buscar por ID, vendedor ou cliente..."
                    onAdd={() => navigate("/Vendas/CadastrarVenda")}
                    onSearch={handleSearch}
                />
            </div>

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "20px",
                    alignItems: "center",
                }}
            >
                <input
                    type="text"
                    value={dataInicial}
                    onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "");
                        if (v.length > 8) v = v.slice(0, 8);
                        if (v.length >= 5) v = v.replace(/(\d{2})(\d{2})(\d+)/, "$1/$2/$3");
                        else if (v.length >= 3) v = v.replace(/(\d{2})(\d+)/, "$1/$2");
                        setDataInicial(v);
                    }}
                    placeholder="Data inicial"
                    style={{ padding: "10px 14px", height: "38px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px", outline: "none", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
                />

                <input
                    type="text"
                    value={dataFinal}
                    onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "");
                        if (v.length > 8) v = v.slice(0, 8);
                        if (v.length >= 5) v = v.replace(/(\d{2})(\d{2})(\d+)/, "$1/$2/$3");
                        else if (v.length >= 3) v = v.replace(/(\d{2})(\d+)/, "$1/$2");
                        setDataFinal(v);
                    }}
                    placeholder="Data final"
                    style={{ padding: "10px 14px", height: "38px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px", outline: "none", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
                />
            </div>

            <DataTable
                columns={columns}
                data={vendas.map((v) => ({
                    id: v.id,
                    vendedor: v.vendedorNome ?? "—",
                    cliente: v.clienteNome ?? "—",
                    valor: typeof v.valorTotal === "number" ? v.valorTotal.toFixed(2).replace(".", ",") : "0,00",
                    data: v.dataVenda ? new Date(v.dataVenda).toLocaleDateString("pt-BR") : "—",
                }))}
                onView={(id) => {
                    const venda = vendas.find((v) => v.id === id);
                    navigate(`/Vendas/VisualizarVenda/${id}`, { state: venda });
                }}
                onEdit={isGerente ? (id) => navigate(`/Vendas/EditarVenda/${id}`) : undefined}
                onDelete={isGerente ? (id) => {
                    const v = vendas.find((v) => v.id === id);
                    if (v) setVendaParaExcluir(v); // ✅ abre modal
                } : undefined}
            />

            <Pagination
                currentPage={currentPage + 1}
                totalPages={totalPages}
                onPageChange={(p) => setCurrentPage(p - 1)}
            />

            {/* ✅ renderiza modal se houver vendaParaExcluir */}
            {vendaParaExcluir && (
                <ExcluirVenda
                    venda={vendaParaExcluir}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setVendaParaExcluir(null)}
                />
            )}
        </PageLayout>
    );
}
