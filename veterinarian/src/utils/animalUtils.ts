/**
 * Utility functions for animal-related operations
 */

// Import default images
import dogDefaultImage from '../assets/dog_default.png'
import catDefaultImage from '../assets/cat_default.png'

/**
 * Gets the appropriate default avatar for an animal based on its species
 * @param species - The species of the animal (e.g., "Perro", "Gato", "Dog", "Cat")
 * @param name - The name of the animal for unique avatar generation (optional, for fallback)
 * @returns URL for the default avatar
 */
export function getDefaultAnimalAvatar(species: string | undefined, name: string): string {
  const normalizedSpecies = species?.toLowerCase() || ''

  // Check if it's a dog (Spanish or English)
  if (normalizedSpecies.includes('perro') || normalizedSpecies.includes('dog')) {
    return dogDefaultImage
  }

  // Check if it's a cat (Spanish or English)
  if (normalizedSpecies.includes('gato') || normalizedSpecies.includes('cat')) {
    return catDefaultImage
  }

  // Default for other animals - use generated avatar as fallback with brand color
  return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${name}-pet&backgroundColor=fef3c7&scale=80`
}

/**
 * Gets the appropriate animal avatar, using profileImageUrl if available, otherwise default
 * @param species - The species of the animal
 * @param name - The name of the animal
 * @param profileImageUrl - The profile image URL from the backend (optional)
 * @returns URL for the animal avatar
 */
export function getAnimalAvatar(
  species: string | undefined,
  name: string,
  profileImageUrl?: string | null
): string {
  // If we have a profile image URL, use it
  if (profileImageUrl && profileImageUrl.trim() !== '') {
    return profileImageUrl
  }

  // Otherwise, use default based on species
  return getDefaultAnimalAvatar(species, name)
}

/**
 * Gets an emoji representation of the animal species
 * @param species - The species of the animal
 * @returns Emoji string
 */
export function getAnimalEmoji(species: string | undefined): string {
  const normalizedSpecies = species?.toLowerCase() || ''

  if (normalizedSpecies.includes('perro') || normalizedSpecies.includes('dog')) {
    return '🐕'
  }

  if (normalizedSpecies.includes('gato') || normalizedSpecies.includes('cat')) {
    return '🐱'
  }

  // Default for other animals
  return '🐾'
}