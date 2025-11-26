// src/components/Formulario.tsx
import { useEffect, useState } from "react";

interface Campo {
    label: string;
    name: string;
    type: string;
    options?: string[];
    readOnly?: boolean;
}

interface FormularioProps {
    campos: Campo[];
    dadosIniciais?: Record<string, string | number>;
    somenteLeitura?: boolean;
    onChange?: (formData: Record<string, string | number>) => void;
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

    function handleChange(name: string, value: string) {
        const campo = campos.find((c) => c.name === name);

        if (somenteLeitura || campo?.readOnly) return;

        const novo = { ...formData, [name]: value };
        setFormData(novo);
        onChange?.(novo);
    }

    return (
        <div className="flex flex-col gap-4">
            {campos.map((campo) => {
                const disabled = somenteLeitura || campo.readOnly;

                if (campo.type === "itensVenda") {
                    const produtos = (campo as any).produtos ?? [];
                    const itens = (formData["itens"] as any[]) ?? [];

                    return (
                        <div key={campo.name} className="flex flex-col">
                            <label className="text-white font-semibold mb-1">Itens da Venda</label>

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
                                        precoUnitario: produto.preco
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

                            {/* LISTA DE ITENS */}
                            <div className="flex flex-col gap-2 mt-3">
                                {itens.map((item, i) => {
                                    const produto = produtos.find((p) => p.id === item.produtoId);

                                    return (
                                        <div
                                            key={i}
                                            className="bg-[#265b58] p-3 rounded-md text-white flex justify-between items-center"
                                        >
                                        <span>
                                            {produto?.nome} — {item.quantidade} un
                                        </span>

                                            {!somenteLeitura && (
                                                <button
                                                    className="bg-red-500 px-2 py-1 rounded-md"
                                                    onClick={() => {
                                                        const novos = itens.filter((_, idx) => idx !== i);
                                                        handleChange("itens", novos);
                                                    }}
                                                >
                                                    Remover
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
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
