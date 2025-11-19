export interface Venda {
    id: number;
    vendedor: string;
    cliente: string;
    valor: number;   // deixe como number, formatamos na tela
    data: string;    // pode ser string ou Date
}
