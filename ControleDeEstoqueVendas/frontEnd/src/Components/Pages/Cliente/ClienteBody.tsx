// src/Pages/Clientes/ClienteBody.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageLayout from "../../PageLayout";
import SearchBar from "../../SearchBar";
import DataTable from "../../DataTable";
import Pagination from "../../Pagination";

import ExcluirModal from "../../ModalExcluir";
import { listarClientes, excluirCliente } from "../../../api/clienteService";
import type { Cliente } from "../../../types/Cliente";

export default function ClienteBody() {
    const navigate = useNavigate();

    const [allClientes, setAllClientes] = useState<Cliente[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    // Modal
    const [modalAberto, setModalAberto] = useState(false);
    const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);

    // Carregar clientes
    useEffect(() => {
        async function fetchClientes() {
            try {
                const data = await listarClientes();
                setAllClientes(data);
                setClientes(data);
            } catch (error) {
                console.error("Erro ao carregar clientes:", error);
            }
        }
        fetchClientes();
    }, []);

    // Busca
    function handleSearch(term: string) {
        const t = (term || "").trim().toLowerCase();

        if (!t) {
            setClientes(allClientes);
            return;
        }

        const filtrados = allClientes.filter((c) => {
            const nome = (c.nome ?? "").toLowerCase();
            const cpf = (c.cpf ?? "").toLowerCase();

            return nome.includes(t) || cpf.includes(t);
        });

        setClientes(filtrados);
        setCurrentPage(1);
    }


    // Abrir modal
    function abrirModal(cliente: Cliente) {
        setClienteSelecionado(cliente);
        setModalAberto(true);
    }

    // Confirmar exclusão
    async function confirmarExclusao() {
        if (!clienteSelecionado) return;

        try {
            await excluirCliente(clienteSelecionado.id!);

            setAllClientes((prev) => prev.filter((c) => c.id !== clienteSelecionado.id));
            setClientes((prev) => prev.filter((c) => c.id !== clienteSelecionado.id));
        } catch (error) {
            console.error("Erro ao excluir cliente:", error);
        } finally {
            setModalAberto(false);
            setClienteSelecionado(null);
        }
    }

    return (
        <PageLayout title="Clientes">
            <SearchBar
                placeholder="Buscar:"
                onAdd={() => navigate("/Clientes/CadastrarCliente")}
                onSearch={handleSearch}
            />

            <DataTable
                columns={["ID", "NOME", "TELEFONE", "CPF", "EDITAR", "EXCLUIR"]}
                data={clientes.map((c) => ({
                    id: c.id,
                    nome: c.nome,
                    telefone: c.telefone,
                    cpf: c.cpf,
                }))}
                onEdit={(id) => {
                    const cli = clientes.find((x) => x.id === id);
                    if (cli) navigate(`/Clientes/EditarCliente/${id}`, { state: { cliente: cli } });
                }}
                onDelete={(id) => {
                    const cli = clientes.find((x) => x.id === id);
                    if (cli) abrirModal(cli);
                }}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={Math.max(1, Math.ceil(clientes.length / 10))}
                onPageChange={(p) => setCurrentPage(p)}
            />

            {modalAberto && clienteSelecionado && (
                <ExcluirModal
                    tipo="Cliente"
                    itemNome={clienteSelecionado.nome}
                    onConfirm={confirmarExclusao}
                    onCancel={() => setModalAberto(false)}
                />
            )}
        </PageLayout>
    );
}
