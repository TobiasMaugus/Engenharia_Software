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
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 3; // depois ajustaremos com backend

    // Carrega vendas ao montar página
    useEffect(() => {
        async function carregar() {
            try {
                const data = await listarVendas();
                setVendas(data);
            } catch (error) {
                console.error("Erro ao carregar vendas:", error);
            }
        }

        carregar();
    }, []);

    // Excluir venda
    async function handleDelete(id: number) {
        if (!confirm("Tem certeza que deseja excluir esta venda?")) return;

        try {
            await excluirVenda(id);

            // atualiza a tabela localmente
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

                // formatamos valor e data para exibição bonita
                data={vendas.map((v) => ({
                    ...v,
                    valor: v.valor.toFixed(2).replace(".", ","), // "230,00"
                    data: new Date(v.data).toLocaleDateString("pt-BR"),
                }))}

                onView={(id) => navigate(`/Vendas/VisualizarVenda/${id}`)}
                onEdit={(id) => navigate(`/Vendas/EditarVenda/${id}`)}
                onDelete={(id) => handleDelete(id)}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => setCurrentPage(p)}
            />
        </PageLayout>
    );
}
