import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageLayout from "../../PageLayout";
import SearchBar from "../../SearchBar";
import DataTable from "../../DataTable";
import Pagination from "../../Pagination";
import ExcluirModal from "../../ModalExcluir";
import { listarProdutos, excluirProduto } from "../../../api/produtoService";
import type { Produto } from "../../../types/Produto";

import { getUserFromToken } from "../../../api/auth";

export default function ProdutoBody() {
    const navigate = useNavigate();

    const [allProdutos, setAllProdutos] = useState<Produto[]>([]);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const [modalAberto, setModalAberto] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);

    // Pega o usuário logado
    const user = getUserFromToken();
    const isGerente = user?.role === "GERENTE";

    useEffect(() => {
        async function fetchProdutos() {
            try {
                const data = await listarProdutos();
                setAllProdutos(data);
                setProdutos(data);
            } catch (error) {
                console.error("Erro ao carregar produtos:", error);
            }
        }
        fetchProdutos();
    }, []);

    function handleSearch(term: string) {
        const t = (term || "").trim().toLowerCase();
        if (!t) {
            setProdutos(allProdutos);
            return;
        }
        const filtrados = allProdutos.filter((p) =>
            (p.nome ?? "").toLowerCase().includes(t) ||
            (p.categoria?? "").toLowerCase().includes(t)
        );
        setProdutos(filtrados);
        setCurrentPage(1);
    }


    function abrirModal(produto: Produto) {
        setProdutoSelecionado(produto);
        setModalAberto(true);
    }

    async function confirmarExclusao() {
        if (!produtoSelecionado) return;
        try {
            await excluirProduto(produtoSelecionado.id!);
            setAllProdutos((prev) => prev.filter((p) => p.id !== produtoSelecionado.id));
            setProdutos((prev) => prev.filter((p) => p.id !== produtoSelecionado.id));
        } catch (error) {
            console.error("Erro ao excluir produto:", error);
        } finally {
            setModalAberto(false);
            setProdutoSelecionado(null);
        }
    }

    const pageSize = 10;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const produtosPaginados = produtos.slice(startIndex, endIndex);

    const columns = ["ID", "NOME", "CATEGORIA", "PREÇO"];
    if (isGerente) {
        columns.push("EDITAR", "EXCLUIR");
    }

    return (
        <PageLayout title="Produtos">
            <SearchBar
                placeholder="Buscar:"
                onAdd={() => navigate("/Produtos/CadastrarProduto")}
                onSearch={handleSearch}
            />

            <DataTable
                columns={columns}
                data={produtosPaginados.map((p) => ({
                    id: p.id,
                    nome: p.nome,
                    categoria: p.categoria,
                    preco: p.preco,
                }))}
                onEdit={isGerente ? (id) => {
                    const prod = produtos.find((x) => x.id === id);
                    if (prod) navigate(`/Produtos/EditarProduto/${id}`, { state: { produto: prod } });
                } : undefined}
                onDelete={isGerente ? (id) => {
                    const prod = produtos.find((x) => x.id === id);
                    if (prod) abrirModal(prod);
                } : undefined}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={Math.max(1, Math.ceil(produtos.length / pageSize))}
                onPageChange={(p) => setCurrentPage(p)}
            />

            {modalAberto && produtoSelecionado && (
                <ExcluirModal
                    tipo="Produto"
                    itemNome={produtoSelecionado.nome}
                    onConfirm={confirmarExclusao}
                    onCancel={() => setModalAberto(false)}
                />
            )}
        </PageLayout>
    );
}
