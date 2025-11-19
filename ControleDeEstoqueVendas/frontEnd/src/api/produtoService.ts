// src/api/produtoService.ts
import api from "./api";
import type {Produto} from "../types/Produto.ts";

const path = "/produtos";

export async function listarProdutos(): Promise<Produto[]> {
    const r = await api.get(path);
    return r.data;
}

export async function criarProduto(produto: {
    id: number | undefined;
    nome: string;
    categoria: string;
    preco: number;
    quantidade: number
}): Promise<Produto> {
    const r = await api.post(path, produto);
    return r.data;
}

export async function editarProduto(id: number, p: {
    nome: string;
    categoria: string;
    preco: number;
    quantidade: number
}): Promise<Produto> {
    const r = await api.put(`${path}/${id}`, p);
    return r.data;
}

export async function excluirProduto(id: number): Promise<void> {
    await api.delete(`${path}/${id}`);
}

export async function listarProdutoPorId(id: number): Promise<Produto> {
    const r = await api.get(`${path}/${id}`);
    return r.data;
}
