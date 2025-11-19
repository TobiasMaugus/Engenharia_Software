export interface Produto {
    id: number;
    nome: string;
    categoria: string;
    preco: number;        // importante: number, não string
    quantidadeEstoque: number;
}
