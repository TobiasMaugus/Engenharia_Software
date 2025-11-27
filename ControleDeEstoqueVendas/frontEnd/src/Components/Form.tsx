// src/components/Formulario.tsx
import { useEffect, useState } from "react";

interface Campo {
    label: string;
    name: string;
    type: string;
    options?: string[];
    readOnly?: boolean;
    produtos?: any[]; // para itensVenda
}

interface FormularioProps {
    campos: Campo[];
    dadosIniciais?: Record<string, any>; // pode ter array de itens
    somenteLeitura?: boolean;
    onChange?: (formData: Record<string, any>) => void;
}

export default function Formulario({
                                       campos,
                                       dadosIniciais = {},
                                       somenteLeitura = false,
                                       onChange
                                   }: FormularioProps) {

    const [formData, setFormData] = useState(dadosIniciais);

    useEffect(() => {
        setFormData(dadosIniciais);
    }, [dadosIniciais]);

    function handleChange(name: string, value: any) {
        const campo = campos.find((c) => c.name === name);

        if (somenteLeitura || campo?.readOnly) return;

        setFormData((prev) => {
            const novo = { ...prev, [name]: value };
            onChange?.(novo);
            return novo;
        });
    }

    return (
        <div className="flex flex-col gap-4">
            {campos.map((campo) => {
                const disabled = somenteLeitura || campo.readOnly;

                if (campo.type === "itensVenda") {
                    const produtos = campo.produtos ?? [];
                    const itens = (formData["itens"] as any[]) ?? [];

                    return (
                        <div key={campo.name} className="flex flex-col">
                            <label className="text-white font-semibold mb-1">Itens da Venda</label>

                            {/* SELECT PARA ADICIONAR PRODUTO */}
                            <select
                                disabled={disabled}
                                className="bg-[#357F7D] text-white px-4 py-2 rounded-md disabled:opacity-60"
                                onChange={(e) => {
                                    const produtoId = Number(e.target.value);
                                    if (!produtoId) return;

                                    const produto = produtos.find((p) => p.id === produtoId);
                                    if (!produto) return;

                                    const novoItem = {
                                        produtoId: produto.id,
                                        quantidade: 1,
                                        precoUnitario: produto.preco,
                                    };

                                    const novos = [...itens, novoItem];
                                    handleChange("itens", novos);
                                }}
                            >
                                <option value="">Adicionar Produto...</option>
                                {produtos.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.nome} — R$ {p.preco}
                                    </option>
                                ))}
                            </select>

                            {/* TABELA DE ITENS */}
                            <div className="overflow-x-auto rounded-md shadow mt-4">
                                <table className="min-w-full border-collapse">
                                    <thead className="bg-[#357F7D] text-white">
                                    <tr>
                                        <th className="border border-gray-500 p-2">Produto</th>
                                        <th className="border border-gray-500 p-2">Quantidade</th>
                                        <th className="border border-gray-500 p-2">Preço Unitário</th>
                                        <th className="border border-gray-500 p-2">Subtotal</th>
                                        {!somenteLeitura && (
                                            <th className="border border-gray-500 p-2">Ações</th>
                                        )}
                                    </tr>
                                    </thead>

                                    <tbody className="bg-[#2F3A3A] text-white">
                                    {itens.map((item, i) => {
                                        const produto = produtos.find((p) => p.id === item.produtoId);
                                        if (!produto) return null;

                                        return (
                                            <tr key={i}>
                                                <td className="border border-gray-600 p-2">{produto.nome}</td>

                                                {/* QUANTIDADE EDITÁVEL */}
                                                <td className="border border-gray-600 p-2">
                                                    {!somenteLeitura ? (
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            value={item.quantidade}
                                                            className="w-16 text-white px-2 py-1 rounded-md appearance-none"
                                                            onChange={(e) => {
                                                                const valor = e.target.value;
                                                                const novaQtd = valor === "" ? "" : Number(valor);
                                                                if (novaQtd !== "" && (isNaN(novaQtd) || novaQtd < 1)) return;

                                                                const novosItens = itens.map((it, idx) =>
                                                                    idx === i
                                                                        ? { ...it, quantidade: novaQtd === "" ? "" : novaQtd }
                                                                        : it
                                                                );
                                                                handleChange("itens", novosItens);
                                                            }}
                                                        />
                                                    ) : (
                                                        item.quantidade
                                                    )}
                                                </td>

                                                <td className="border border-gray-600 p-2">
                                                    R$ {item.precoUnitario.toFixed(2).replace(".", ",")}
                                                </td>

                                                <td className="border border-gray-600 p-2">
                                                    R$ {(
                                                    item.precoUnitario *
                                                    (Number(item.quantidade) || 0)
                                                ).toFixed(2).replace(".", ",")}
                                                </td>

                                                {!somenteLeitura && (
                                                    <td className="border border-gray-600 p-2">
                                                        <button
                                                            type="button"
                                                            className="bg-red-500 px-2 py-1 rounded-md"
                                                            onClick={() => {
                                                                const novos = itens.filter((_, idx) => idx !== i);
                                                                handleChange("itens", novos);
                                                            }}
                                                        >
                                                            Remover
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                }

                return (
                    <div key={campo.name} className="flex flex-col">
                        <label className="text-white font-semibold mb-1">{campo.label}</label>

                        {campo.type === "select" ? (
                            <select
                                disabled={disabled}
                                value={formData[campo.name] ?? ""}
                                onChange={(e) => handleChange(campo.name, e.target.value)}
                                className="bg-[#357F7D] text-white px-4 py-2 rounded-md disabled:opacity-60"
                            >
                                <option value="">Selecione...</option>
                                {campo.options?.map((op) => (
                                    <option key={op} value={op}>
                                        {op}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={campo.type}
                                placeholder={campo.label}
                                disabled={disabled}
                                readOnly={campo.readOnly}
                                value={formData[campo.name] ?? ""}
                                onChange={(e) => handleChange(campo.name, e.target.value)}
                                className="bg-[#357F7D] text-white placeholder-gray-200 px-4 py-2 rounded-md disabled:opacity-60"
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
