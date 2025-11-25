import api from "./api";
import type { Venda } from "../types/Venda";

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    pageable?: any;
    size?: number;
    number?: number;
}

const path = "/vendas";

export async function listarVendas(page = 0): Promise<PageResponse<Venda>> {
    const r = await api.get(`${path}?page=${page}`);
    return r.data; // page.content, page.totalPages, etc
}

export async function criarVenda(body: Venda): Promise<Venda> {
    const r = await api.post(path, body);
    return r.data;
}

export async function buscarVenda(id: number): Promise<Venda> {
    const r = await api.get(`${path}/${id}`);
    return r.data;
}

export async function excluirVenda(id: number): Promise<void> {
    await api.delete(`${path}/${id}`);
}
