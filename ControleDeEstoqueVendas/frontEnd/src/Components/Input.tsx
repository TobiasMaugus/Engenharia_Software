import React from 'react'

type Props = {
    label?: string
    type?: string
    placeholder?: string
    value?: string
    onChange?: React.ChangeEventHandler<HTMLInputElement>
}

// Função auxiliar para criar um ID seguro a partir de um texto
const createIdFromText = (text: string | undefined): string | undefined => {
    if (!text) {
        return undefined
    }
    // Converte para minúsculas, substitui espaços e caracteres não alfanuméricos por traços
    return text.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

export default function Input({ label, type = 'text', placeholder, value, onChange }: Props) {

    // 1. Prioriza o placeholder, mas se não existir, usa o label para gerar o ID
    const baseText = placeholder || label;
    const inputId = createIdFromText(baseText);

    return (
        <div className="flex flex-col">
            {/* Associa o label ao input usando htmlFor */}
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-sm font-medium text-gray-700 mb-1"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId} // 2. Insere o ID gerado (ex: "nome", "categoria", "preco")
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
        </div>
    )
}