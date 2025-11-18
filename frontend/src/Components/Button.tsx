import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export default function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: Props) {
  const base =
    'w-full px-4 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-1'

  const variants: Record<string, string> = {
    primary:
      'bg-primary text-white hover:brightness-95 focus:ring-primary',
    secondary:
      'bg-accent text-white hover:brightness-95 focus:ring-accent',
    ghost:
      'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-300'
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
