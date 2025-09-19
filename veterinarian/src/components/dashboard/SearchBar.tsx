import { InputHTMLAttributes } from 'react'

type SearchFilter = 'owner' | 'pet' | 'breed'

type Props = {
  value: string
  onChange: (value: string) => void
  searchFilter?: SearchFilter
  onFilterChange?: (filter: SearchFilter) => void
  placeholder?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'placeholder'>

export default function SearchBar({
  value,
  onChange,
  searchFilter = 'pet',
  onFilterChange,
  placeholder,
  ...props
}: Props) {
  const getPlaceholder = () => {
    if (placeholder) return placeholder

    switch (searchFilter) {
      case 'owner':
        return 'Buscar por nombre de dueño...'
      case 'pet':
        return 'Buscar por nombre de mascota...'
      case 'breed':
        return 'Buscar por raza...'
      default:
        return 'Buscar por nombre de mascota...'
    }
  }

  return (
    <div className="search">
      <span className="search__icon" aria-hidden>🔎</span>
      <input
        className="search__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={getPlaceholder()}
        {...props}
      />
      {onFilterChange && (
        <div className="search__filter">
          <select
            className="search__filterSelect"
            value={searchFilter}
            onChange={(e) => onFilterChange(e.target.value as SearchFilter)}
          >
            <option value="pet">Nombre de mascota</option>
            <option value="owner">Nombre del dueño</option>
            <option value="breed">Raza</option>
          </select>
        </div>
      )}
    </div>
  )
}


