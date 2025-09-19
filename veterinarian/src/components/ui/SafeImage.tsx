import { useState } from 'react'
import { getDefaultAnimalAvatar } from '../../utils/animalUtils'

interface SafeImageProps {
  src: string | null | undefined
  fallbackSpecies?: string
  fallbackName: string
  alt: string
  className?: string
  style?: React.CSSProperties
}

export default function SafeImage({
  src,
  fallbackSpecies,
  fallbackName,
  alt,
  className,
  style
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  // If there's an error or no src, use fallback
  const shouldUseFallback = hasError || !src || src.trim() === ''

  const imageSrc = shouldUseFallback
    ? getDefaultAnimalAvatar(fallbackSpecies, fallbackName)
    : src

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      onLoad={handleLoad}
    />
  )
}