import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return <div className={`card ${className}`}>{children}</div>
}

export function CardHeader({ children }: { children: ReactNode }) {
  return <div className="card__header">{children}</div>
}

export function CardContent({ children }: { children: ReactNode }) {
  return <div className="card__content">{children}</div>
}

export function CardFooter({ children }: { children: ReactNode }) {
  return <div className="card__footer">{children}</div>
}

export default Card


