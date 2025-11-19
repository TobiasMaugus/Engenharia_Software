import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageLayout from "../../PageLayout";
import SearchBar from "../../SearchBar";
import DataTable from "../../DataTable";
import Pagination from "../../Pagination";

import ExcluirModal from "../../ModalExcluir";
import { listarProdutos, excluirProduto } from "../../../api/produtoService";
import type { Produto } from "../../../types/Produto";

export default function ProdutoBody() {
    const navigate = useNavigate();

    // lista completa (fonte de verdade) e lista exibida (filtrada)
    const [allProdutos, setAllProdutos] = useState<Produto[]>([]);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    // Modal
    const [modalAberto, setModalAberto] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);

    // ------------------------------
    // Carregar produtos
    // ------------------------------
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

    // ------------------------------
    // Função de busca (cliente)
    // ------------------------------
    function handleSearch(term: string) {
        const q = (term || "").trim().toLowerCase();
        if (!q) {
            // sem termo -> mostra tudo
            setProdutos(allProdutos);
            return;
        }
        const filtrados = allProdutos.filter((p) =>
            (p.nome ?? "").toString().toLowerCase().includes(q)
        );
        setProdutos(filtrados);
        setCurrentPage(1); // opcional: volta pra primeira página ao buscar
    }

    // ------------------------------
    // Abrir modal
    // ------------------------------
    function abrirModal(produto: Produto) {
        setProdutoSelecionado(produto);
        setModalAberto(true);
    }

    // ------------------------------
    // Confirmar exclusão
    // ------------------------------
    async function confirmarExclusao() {
        if (!produtoSelecionado) return;

        try {
            await excluirProduto(produtoSelecionado.id!);
            // remover das duas listas
            setAllProdutos((prev) => prev.filter((p) => p.id !== produtoSelecionado.id));
            setProdutos((prev) => prev.filter((p) => p.id !== produtoSelecionado.id));
        } catch (error) {
            console.error("Erro ao excluir:", error);
        } finally {
            setModalAberto(false);
            setProdutoSelecionado(null);
        }
    }

    return (
        <PageLayout title="Produtos">
            <SearchBar
                placeholder="Buscar:"
                onAdd={() => navigate("/Produtos/CadastrarProduto")}
                onSearch={handleSearch} // se seu SearchBar aceitar essa prop, ótimo
            />

            <DataTable
                columns={[
                    "ID",
                    "NOME",
                    "CATEGORIA",
                    "PREÇO",
                    "QUANTIDADE",
                    "EDITAR",
                    "EXCLUIR",
                ]}
                data={produtos.map((p) => ({
                    id: p.id,
                    nome: p.nome,
                    categoria: p.categoria,
                    preco: Number(p.preco).toFixed(2).replace(".", ","),
                    quantidade: p.quantidadeEstoque,
                }))}
                onEdit={(id) => {
                    const p = produtos.find((prod) => prod.id === id);
                    if (p) navigate(`/Produtos/EditarProduto/${id}`, { state: { produto: p } });
                }}
                onDelete={(id) => {
                    const p = produtos.find((prod) => prod.id === id);
                    if (p) abrirModal(p);
                }}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={Math.max(1, Math.ceil(produtos.length / 10))} // ajustável
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
