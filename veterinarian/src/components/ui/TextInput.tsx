import { type InputHTMLAttributes, type ReactNode } from 'react'

type TextInputProps = {
  label?: string
  error?: string
  leftIcon?: ReactNode
} & InputHTMLAttributes<HTMLInputElement>

export function TextInput({ label, error, leftIcon, id, className = '', ...props }: TextInputProps) {
  const inputId = id || props.name

  return (
    <div className={`field ${error ? 'field--error' : ''}`}>
      {label && (
        <label className="field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className={`field__inputWrapper ${leftIcon ? 'field__inputWrapper--withIcon' : ''}`}>
        {leftIcon && <span className="field__icon">{leftIcon}</span>}
        <input id={inputId} className={`field__input ${className}`} {...props} />
      </div>
      {error && <div className="field__error">{error}</div>}
    </div>
  )
}

export default TextInput


