export interface Venda {
    id: number;

    vendedorId: number;
    vendedorNome: string;

    clienteId: number;
    clienteNome: string;

    valorTotal: number;
    dataVenda: string;

    itens?: any[];
}
