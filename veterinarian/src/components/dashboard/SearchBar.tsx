import { InputHTMLAttributes } from 'react'

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'placeholder'>

export default function SearchBar({ value, onChange, placeholder = 'Buscar mascota por nombre, dueño, raza o especie...', ...props }: Props) {
  return (
    <div className="search">
      <span className="search__icon" aria-hidden>🔎</span>
      <input
        className="search__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        {...props}
      />
    </div>
  )
}


