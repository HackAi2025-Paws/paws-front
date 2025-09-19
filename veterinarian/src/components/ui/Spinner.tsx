import './Spinner.css'

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
  className?: string
}

export default function Spinner({ size = 'medium', text, className = '' }: SpinnerProps) {
  return (
    <div className={`spinner-container ${className}`}>
      <div className={`spinner spinner--${size}`}>
        <div className="spinner__circle"></div>
      </div>
      {text && <div className="spinner__text">{text}</div>}
    </div>
  )
}