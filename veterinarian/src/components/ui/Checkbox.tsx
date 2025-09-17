import { InputHTMLAttributes } from 'react'

type Props = { label: string } & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export default function Checkbox({ label, ...props }: Props) {
  return (
    <label className="checkbox">
      <input type="checkbox" className="checkbox__input" {...props} />
      <span className="checkbox__label">{label}</span>
    </label>
  )
}


