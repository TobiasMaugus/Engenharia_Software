import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import CadastroEdicaoForm from "../../CadastroEdicaoForm";
import { listarClientes } from "../../../api/clienteService";
import { listarProdutos } from "../../../api/produtoService";
import { buscarVenda } from "../../../api/vendaService";

export default function EditarVenda() {
    const { id } = useParams<{ id?: string }>();
    const vendaId = Number(id);

    const [clientes, setClientes] = useState<any[]>([]);
    const [produtos, setProdutos] = useState<any[]>([]);
    const [dados, setDados] = useState<any>(null);

    useEffect(() => {
        async function load() {
            const [listaClientes, listaProdutos] = await Promise.all([
                listarClientes(),
                listarProdutos(),
            ]);

            setClientes(listaClientes);
            setProdutos(listaProdutos);

            if (!vendaId || isNaN(vendaId)) {
                setDados({ clienteId: "", itens: [] });
                return;
            }

            const venda = await buscarVenda(vendaId);
            console.log("VENDA REAL CARREGADA:", venda);

            const clienteId = venda?.clienteId
                ? `${venda.clienteId} - ${venda.clienteNome}`
                : "";

            // ---------------------------
            // MAPEAMENTO CORRIGIDO DOS ITENS
            // ---------------------------
            const itens = (venda.itens ?? []).map((item: any) => {
                const prod = item.produto || {};

                return {
                    produtoId: item.id?.produtoId ?? "",  // vem do backend
                    quantidade: item.quantidade ?? 1,
                    nomeProduto: prod.nome ?? "",
                    precoUnitario: item.precoUnitario ?? prod.preco ?? 0,
                    total: (item.precoUnitario ?? prod.preco ?? 0) * (item.quantidade ?? 1),
                };
            });

            setDados({
                clienteId,
                itens
            });
        }

        load();
    }, [id]);

    if (!dados) return <p className="text-white p-6">Carregando...</p>;

    return (
        <CadastroEdicaoForm
            titulo="Editar Venda"
            tipo="venda"
            modo="editar"
            campos={[
                {
                    label: "Cliente",
                    name: "clienteId",
                    type: "select",
                    options: clientes.map((c) => `${c.id} - ${c.nome}`),
                },
                {
                    label: "Itens da Venda",
                    name: "itens",
                    type: "itensVenda",
                    produtos: produtos,
                },
            ]}
            dadosIniciais={dados}
        />
    );
}
