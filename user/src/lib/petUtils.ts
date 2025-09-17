import type { Pet } from '../types/index.js'

/**
 * Detecta qué tipos de animales tiene el usuario basándose en sus mascotas
 */
export function detectPetSpecies(pets: Pet[]): ('perro' | 'gato' | 'general')[] {
  if (pets.length === 0) {
    return ['general'] // Si no tiene mascotas, mostrar preguntas generales
  }

  const species = new Set<'perro' | 'gato'>()
  
  for (const pet of pets) {
    const breed = pet.breed.toLowerCase()
    
    // Detectar perros por razas comunes
    const dogBreeds = [
      'golden retriever', 'labrador', 'pastor', 'bulldog', 'chihuahua', 
      'poodle', 'beagle', 'rottweiler', 'boxer', 'dálmata', 'husky',
      'schnauzer', 'cocker', 'yorkshire', 'maltés', 'pug', 'caniche',
      'pitbull', 'border collie', 'springer', 'pointer', 'setter',
      'mastín', 'galgo', 'fox terrier', 'dogo', 'akita', 'shih tzu',
      'bichón', 'doberman', 'perro', 'mestizo'
    ]
    
    // Detectar gatos por razas comunes  
    const catBreeds = [
      'persa', 'siamés', 'maine coon', 'bengalí', 'ragdoll', 'británico',
      'abisinio', 'birmano', 'sphynx', 'russian blue', 'scottish fold',
      'angora', 'exotic', 'manx', 'oriental', 'balinés', 'bombay',
      'chartreux', 'cornish rex', 'devon rex', 'gato', 'felino', 'común europeo'
    ]
    
    // Buscar coincidencias en razas de perros
    if (dogBreeds.some(dogBreed => breed.includes(dogBreed))) {
      species.add('perro')
    }
    // Buscar coincidencias en razas de gatos
    else if (catBreeds.some(catBreed => breed.includes(catBreed))) {
      species.add('gato')
    }
    // Si no se puede determinar, asumir que es un perro (más común)
    // El usuario puede especificar manualmente si es necesario
    else {
      species.add('perro')
    }
  }
  
  // Convertir Set a Array y agregar 'general' siempre para preguntas universales
  return [...Array.from(species), 'general']
}

/**
 * Obtiene un emoji representativo según la especie
 */
export function getSpeciesEmoji(species: 'perro' | 'gato' | 'general'): string {
  switch (species) {
    case 'perro':
      return '🐕'
    case 'gato':
      return '🐱'
    case 'general':
      return '🐾'
    default:
      return '🐾'
  }
}

/**
 * Obtiene una etiqueta descriptiva según la especie
 */
export function getSpeciesLabel(species: 'perro' | 'gato' | 'general'): string {
  switch (species) {
    case 'perro':
      return 'Perros'
    case 'gato':
      return 'Gatos'
    case 'general':
      return 'General'
    default:
      return 'General'
  }
}
