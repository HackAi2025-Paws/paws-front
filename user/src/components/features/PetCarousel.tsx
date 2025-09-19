import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import type { Pet } from '../../types/index.js'
import { Plus, Calendar, Weight, Cake, Heart, Stethoscope, MapPin } from 'lucide-react'

interface PetCarouselProps {
  pets: Pet[]
}

export const PetCarousel: React.FC<PetCarouselProps> = ({ pets }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Auto-scroll suave al cambiar índice
  useEffect(() => {
    if (carouselRef.current && pets.length > 0) {
      const cardWidth = carouselRef.current.offsetWidth * 0.85 // 85% del ancho del contenedor
      const scrollPosition = currentIndex * cardWidth
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      })
    }
  }, [currentIndex, pets.length])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return
    e.preventDefault()
    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 2
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    // Snap to nearest card
    if (carouselRef.current && pets.length > 0) {
      const cardWidth = carouselRef.current.offsetWidth * 0.85
      const newIndex = Math.round(carouselRef.current.scrollLeft / cardWidth)
      setCurrentIndex(Math.min(Math.max(0, newIndex), pets.length - 1))
    }
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Funciones simplificadas - todas las tarjetas se ven igual
  const isCardActive = (index: number) => index === currentIndex

  if (pets.length === 0) {
    return (
      <Card className="border-dashed border-2 border-red-300 bg-transparent">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-6xl mb-4 animate-bounce">🐾</div>
          <h3 className="text-lg font-semibold text-dark-900 mb-2">
            ¡Agrega tu primera mascota!
          </h3>
          <p className="text-dark-600 text-center mb-4">
            Comienza creando el perfil de tu compañero peludo
          </p>
          <Link to="/pet/add">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar Mascota
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Carrusel estilo billetera virtual */}
      <div className="relative h-64 overflow-hidden">
        <div 
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing h-full pb-4"
          style={{ 
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {pets.map((pet, index) => {
            const isActive = isCardActive(index)
            const upcomingVaccines = pet.vaccinations.filter(v => 
              v.nextDue && new Date(v.nextDue) > new Date()
            ).length
            const totalConsultations = pet.consultationRecords?.length || 0

            return (
              <div
                key={pet.id}
                className="flex-shrink-0 w-[85%] h-full"
                style={{ scrollSnapAlign: 'start' }}
              >
                <Link to={`/pet/${pet.id}`} className="block h-full">
                  <Card className="h-full border-dashed border-2 border-red-300 bg-transparent hover:bg-red-50/30 transition-all duration-300">
                    <CardContent className="p-6 h-full flex flex-col">
                      {/* Header con foto y nombre */}
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="relative w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-orange-300">
                          {pet.photo ? (
                            <img 
                              src={pet.photo} 
                              alt={pet.name}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <div className="text-2xl">
                              {pet.breed.toLowerCase().includes('gat') ? '🐱' : '🐕'}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-dark-900 truncate">
                            {pet.name}
                          </h3>
                          <p className="text-sm text-dark-600 truncate">
                            {pet.breed}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs px-2 py-1 rounded-full bg-pink-100 text-dark-700">
                              {pet.gender === 'macho' ? '♂️' : '♀️'} {pet.age}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Estadísticas rápidas */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-3 rounded-lg text-center bg-cream-200">
                          <Weight className="h-4 w-4 mx-auto mb-1 text-orange-600" />
                          <p className="text-xs text-dark-600">Peso</p>
                          <p className="text-sm font-semibold text-dark-900">
                            {pet.weight && pet.weight.min > 0 
                              ? `${pet.weight.min}-${pet.weight.max} ${pet.weight.unit}`
                              : 'No registrado'
                            }
                          </p>
                        </div>
                        
                        <div className="p-3 rounded-lg text-center bg-cream-200">
                          <Stethoscope className="h-4 w-4 mx-auto mb-1 text-red-600" />
                          <p className="text-xs text-dark-600">Consultas</p>
                          <p className="text-sm font-semibold text-dark-900">
                            {totalConsultations}
                          </p>
                        </div>
                      </div>

                      {/* Alertas importantes */}
                      <div className="flex-1 flex flex-col justify-end">
                        {upcomingVaccines > 0 && (
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-100 text-orange-800">
                            <Calendar className="h-4 w-4" />
                            <span className="text-xs font-medium">
                              {upcomingVaccines} vacuna{upcomingVaccines !== 1 ? 's' : ''} pendiente{upcomingVaccines !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            )
          })}
        </div>

        {/* Indicadores estilo billetera */}
        {pets.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {pets.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`
                  h-2 rounded-full transition-all duration-300 ease-out
                  ${index === currentIndex 
                    ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-500' 
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }
                `}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}