export function Logo({ size = 44 }: { size?: number }) {
  return (
    <div className="logoMark" style={{ width: size, height: size }} aria-label="VetCare Digital">
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="#EAF8EF" />
        <path
          d="M20 10c2.761 0 5 2.239 5 5 0 1.657-1.343 3-3 3h-4a3 3 0 0 1 0-6h2Z"
          fill="#16A34A"
        />
        <path d="M13 22h14a3 3 0 0 1 0 6H13a3 3 0 0 1 0-6Z" fill="#16A34A" />
        <circle cx="26.5" cy="15.5" r="1.5" fill="#065F46" />
      </svg>
    </div>
  )
}

export default Logo


