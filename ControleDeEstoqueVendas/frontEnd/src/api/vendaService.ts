import api from "./api";
import type { Venda } from "../types/Venda";

const path = "/vendas";

export async function listarVendas(): Promise<Venda[]> {
    const r = await api.get(path);
    return r.data;
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
