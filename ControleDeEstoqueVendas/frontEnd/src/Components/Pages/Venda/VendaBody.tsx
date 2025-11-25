import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageLayout from "../../PageLayout";
import SearchBar from "../../SearchBar";
import DataTable from "../../DataTable";
import Pagination from "../../Pagination";

import { listarVendas, excluirVenda } from "../../../api/vendaService";
import type { Venda } from "../../../types/Venda";

export default function VendaBody() {
    const navigate = useNavigate();

    const [vendas, setVendas] = useState<Venda[]>([]);
    const [currentPage, setCurrentPage] = useState(0); // backend é 0-based
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        async function carregar() {
            try {
                const page = await listarVendas(currentPage);

                setVendas(page.content);        // lista de vendas
                setTotalPages(page.totalPages); // total de páginas do backend
            } catch (error) {
                console.error("Erro ao carregar vendas:", error);
            }
        }

        carregar();
    }, [currentPage]);

    async function handleDelete(id: number) {
        if (!confirm("Tem certeza que deseja excluir esta venda?")) return;

        try {
            await excluirVenda(id);

            setVendas((prev) => prev.filter((v) => v.id !== id));
        } catch (error) {
            console.error("Erro ao excluir:", error);
        }
    }

    return (
        <PageLayout title="Vendas">
            <SearchBar
                placeholder="Buscar:"
                onAdd={() => navigate("/Vendas/CadastrarVenda")}
            />

            <DataTable
                columns={[
                    "ID",
                    "VENDEDOR",
                    "CLIENTE",
                    "VALOR",
                    "DATA",
                    "DETALHES",
                    "EDITAR",
                    "EXCLUIR",
                ]}
                data={vendas.map((v) => ({
                    id: v.id,
                    vendedor: v.vendedorNome ?? "—",
                    cliente: v.clienteNome ?? "—",
                    valor:
                        typeof v.valorTotal === "number"
                            ? v.valorTotal.toFixed(2).replace(".", ",")
                            : "0,00",
                    data: v.dataVenda
                        ? new Date(v.dataVenda).toLocaleDateString("pt-BR")
                        : "—",
                }))}


                onView={(id) => navigate(`/Vendas/VisualizarVenda/${id}`)}
                onEdit={(id) => navigate(`/Vendas/EditarVenda/${id}`)}
                onDelete={(id) => handleDelete(id)}
            />

            <Pagination
                currentPage={currentPage + 1}          // mostra 1-based na tela
                totalPages={totalPages}
                onPageChange={(p) => setCurrentPage(p - 1)} // recebe 1-based → converte para 0-based
            />
        </PageLayout>
    );
}
