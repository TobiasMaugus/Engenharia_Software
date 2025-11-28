// src/api/clienteService.ts
import api from "./api";
import type { Cliente } from "../types/Cliente";

const path = "/clientes";

export async function listarClientes(): Promise<Cliente[]> {
    const r = await api.get(path);
    return r.data;
}

export async function listarClientePorId(id: number): Promise<Cliente> {
    const r = await api.get(`${path}/${id}`);
    return r.data;
}

export async function criarCliente(cliente: {
    id?: number;
    nome: string;
    telefone?: string;
    cpf?: string;
}): Promise<Cliente> {
    const r = await api.post(path, cliente);
    return r.data;
}

export async function editarCliente(id: number, cliente: {
    nome: string;
    telefone?: string;
    cpf?: string;
}): Promise<Cliente> {
    const r = await api.put(`${path}/${id}`, cliente);
    return r.data;
}

export async function excluirCliente(id: number): Promise<void> {
    await api.delete(`${path}/${id}`);
}
