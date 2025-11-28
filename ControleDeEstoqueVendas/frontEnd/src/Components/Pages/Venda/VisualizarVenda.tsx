import { useLocation, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function VisualizarVenda() {
    const { id } = useParams();
    const { state: venda } = useLocation();
    const navigate = useNavigate();

    if (!venda) {
        return (
            <div className="text-white text-center mt-10">
                Nenhuma informação foi recebida sobre a venda #{id}.
            </div>
        );
    }

    return (
        <div className="mt-6 mb-6">
            <div className="relative flex flex-col gap-4 bg-[#455150] p-8 rounded-2xl shadow-lg max-w-4xl w-full mx-auto">

                <button
                    onClick={() => navigate(-1)}
                    className="absolute right-8 top-8 bg-[#8EB9AE] p-2 rounded-md hover:bg-[#7aa59b] transition"
                >
                    <ArrowLeft className="text-white" />
                </button>

                <h1 className="text-white text-2xl font-bold mb-4">
                    Detalhes da Venda #{venda.id}
                </h1>

                <div className="bg-[#357F7D] text-white px-4 py-2 rounded-md">
                    Vendedor: {venda.vendedorNome}
                </div>

                <div className="bg-[#357F7D] text-white px-4 py-2 rounded-md">
                    Cliente: {venda.clienteNome}
                </div>

                <div className="bg-[#357F7D] text-white px-4 py-2 rounded-md">
                    Data da Venda: {new Date(venda.dataVenda).toLocaleDateString("pt-BR")}
                </div>

                <div className="bg-[#357F7D] text-white px-4 py-2 rounded-md">
                    Valor Total: R$ {venda.valorTotal.toFixed(2).replace(".", ",")}
                </div>

                <h2 className="text-white text-xl font-semibold mt-6">
                    Produtos da Venda
                </h2>

                <div className="overflow-x-auto rounded-md shadow">
                    <table className="min-w-full border-collapse">
                        <thead className="bg-[#357F7D] text-white">
                        <tr>
                            <th className="border border-gray-500 p-2">Produto</th>
                            <th className="border border-gray-500 p-2">Quantidade</th>
                            <th className="border border-gray-500 p-2">Preço Unitário</th>
                            <th className="border border-gray-500 p-2">Subtotal</th>
                        </tr>
                        </thead>

                        <tbody className="bg-[#2F3A3A] text-white">
                        {venda.itens?.map((item: any) => (
                            <tr key={`${item.id.vendaId}-${item.id.produtoId}`}>
                                <td className="border border-gray-600 p-2">
                                    {item.produto?.nome}
                                </td>
                                <td className="border border-gray-600 p-2">
                                    {item.quantidade}
                                </td>
                                <td className="border border-gray-600 p-2">
                                    R$ {item.precoUnitario.toFixed(2).replace(".", ",")}
                                </td>
                                <td className="border border-gray-600 p-2">
                                    R$ {(item.precoUnitario * item.quantidade)
                                    .toFixed(2)
                                    .replace(".", ",")}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
