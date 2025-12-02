import { useEffect, useState } from "react";
import CadastroEdicaoForm from "../../Components/CadastroEdicaoForm.tsx";
import { listarClientes } from "../../api/clienteService.ts";
import { listarProdutos } from "../../api/produtoService.ts";

export default function CadastrarVenda() {
    const [clientes, setClientes] = useState([]);
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        async function load() {
            setClientes(await listarClientes());
            setProdutos(await listarProdutos());
        }
        load();
    }, []);

    return (
        <CadastroEdicaoForm
            titulo="Cadastrar Venda"
            tipo="venda"
            modo="cadastrar"
            campos={[
                {
                    label: "Cliente",
                    name: "clienteId",
                    type: "select",
                    options: clientes.map((c) => `${c.id} - ${c.nome}`), // corrigido
                },
                {
                    label: "Itens da Venda",
                    name: "itens",
                    type: "itensVenda",
                    produtos: produtos,
                },
            ]}


            dadosIniciais={{ clienteId: "", itens: [] }}
        />
    );
}
