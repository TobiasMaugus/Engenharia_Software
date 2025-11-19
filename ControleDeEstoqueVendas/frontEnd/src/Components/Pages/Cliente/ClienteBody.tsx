// src/Pages/Clientes/ClienteBody.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageLayout from "../../PageLayout";
import SearchBar from "../../SearchBar";
import DataTable from "../../DataTable";
import Pagination from "../../Pagination";

import { listarClientes, excluirCliente } from "../../../api/clienteService";
import type { Cliente } from "../../../types/Cliente";

export default function ClienteBody() {
    const navigate = useNavigate();

    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 3; // ajuste depois com backend

    // Carrega clientes ao montar a página
    useEffect(() => {
        async function carregar() {
            try {
                const data = await listarClientes();
                setClientes(data);
            } catch (error) {
                console.error("Erro ao carregar clientes:", error);
            }
        }

        carregar();
    }, []);

    // Função de excluir cliente
    async function handleDelete(id: number) {
        if (!confirm("Tem certeza que deseja excluir este cliente?")) return;

        try {
            await excluirCliente(id);

            // remove da lista local
            setClientes((prev) => prev.filter((c) => c.id !== id));

        } catch (error) {
            console.error("Erro ao excluir cliente:", error);
        }
    }

    return (
        <PageLayout title="Clientes">
            <SearchBar
                placeholder="Buscar:"
                onAdd={() => navigate("/Clientes/CadastrarCliente")}
            />

            <DataTable
                columns={["ID", "NOME", "TELEFONE", "CPF", "EDITAR", "EXCLUIR"]}
                data={clientes.map((c) => ({
                    id: c.id,
                    nome: c.nome,
                    telefone: c.telefone,
                    cpf: c.cpf,
                    // dataHora é ignorada
                }))}
                onEdit={(id) => navigate(`/Clientes/EditarCliente/${id}`)}
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
