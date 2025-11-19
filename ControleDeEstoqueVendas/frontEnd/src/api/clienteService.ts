// src/api/clienteService.ts
import api from "./api";
import type {Cliente} from "../types/Cliente";

const path = "/clientes"; // ajuste conforme seu controller

export async function listarClientes(): Promise<Cliente[]> {
    const response = await api.get<Cliente[]>("/clientes");
    return response.data;
}

export async function buscarCliente(id: number): Promise<Cliente> {
    const r = await api.get(`${path}/${id}`);
    return r.data;
}

export async function criarCliente(cliente: {
    [p: string]: any;
    id?: number;
    nome: string;
    telefone?: string;
    cpf?: string
}): Promise<Cliente> {
    const r = await api.post(path, cliente);
    return r.data;
}

export async function editarCliente(id: number, cliente: {
    [p: string]: any;
    id?: number;
    nome: string;
    telefone?: string;
    cpf?: string
}): Promise<Cliente> {
    const r = await api.put(`${path}/${id}`, cliente);
    return r.data;
}

export async function excluirCliente(id: number): Promise<void> {
    await api.delete(`${path}/${id}`);
}
