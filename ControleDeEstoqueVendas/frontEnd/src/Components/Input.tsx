import React from 'react'

type Props = {
  label?: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export default function Input({ label, type = 'text', placeholder, value, onChange }: Props) {
  return (
    <div className="flex flex-col">
      {label && <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
      />
    </div>
  )
}