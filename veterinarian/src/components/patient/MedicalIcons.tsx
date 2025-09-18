interface IconProps {
  size?: number
  className?: string
}

export const MedicalIcons = {
  MedicalQuestion: ({ size = 24, className = "" }: IconProps) => (
    <svg width={size} height={size} className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
    </svg>
  ),

  MedicalMicrophone: ({ size = 24, className = "" }: IconProps) => (
    <svg width={size} height={size} className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
    </svg>
  ),

  MedicalSuggestions: ({ size = 24, className = "" }: IconProps) => (
    <svg width={size} height={size} className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-5H18V4l-2-2H8L6 4v2H3.5C2.67 6 2 6.67 2 7.5S2.67 9 3.5 9H4v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V9h.5c.83 0 1.5-.67 1.5-1.5S20.33 6 19.5 6zM8 4h8v2H8V4z"/>
    </svg>
  ),

  Refresh: ({ size = 24, className = "" }: IconProps) => (
    <svg width={size} height={size} className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
    </svg>
  )
}