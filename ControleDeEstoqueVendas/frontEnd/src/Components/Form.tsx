// src/components/Formulario.tsx
import { useState } from "react";

interface Campo {
    label: string;
    name: string;
    type: string;
    options?: string[];
    readOnly?: boolean; // <-- ADICIONADO AQUI
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
                                       onChange,
                                   }: FormularioProps) {

    const [formData, setFormData] = useState(dadosIniciais);

    function handleChange(name: string, value: string) {
        // Impede mudança se estiver em modo view OU se o campo for readOnly
        const campo = campos.find((c) => c.name === name);
        if (somenteLeitura || campo?.readOnly) return;

        const novoForm = { ...formData, [name]: value };
        setFormData(novoForm);
        onChange?.(novoForm);
    }

    return (
        <div className="flex flex-col gap-4">
            {campos.map((campo) => {
                const disabled = somenteLeitura || campo.readOnly;

                return (
                    <div key={campo.name} className="flex flex-col">
                        {campo.type === "select" ? (
                            <select
                                disabled={disabled}
                                value={formData[campo.name] || ""}
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
                                readOnly={campo.readOnly} // <-- IMPORTANTE
                                value={formData[campo.name] || ""}
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
