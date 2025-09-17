import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '../ui/card.js'
import { Badge } from '../ui/badge.js'
import type { Pet } from '../../types/index.js'
import { calculateAge, isUpcoming } from '../../lib/utils.js'
import { Calendar, AlertCircle } from 'lucide-react'

interface PetCardProps {
  pet: Pet
}

export const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const age = calculateAge(pet.birthDate)
  const upcomingAppointments = pet.appointments.filter(
    apt => apt.status === 'programada' && isUpcoming(apt.date)
  )
  const upcomingVaccinations = pet.vaccinations.filter(
    vacc => vacc.nextDue && isUpcoming(vacc.nextDue)
  )
  
  const hasUpcomingEvents = upcomingAppointments.length > 0 || upcomingVaccinations.length > 0

  return (
    <Link to={`/pet/${pet.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md hover:scale-[1.02]">
        <CardContent className="p-0">
          <div className="relative">
            {/* Imagen de la mascota */}
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              {pet.photo ? (
                <img 
                  src={pet.photo} 
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-6xl">🐕</div>
              )}
            </div>
            
            {/* Indicador de eventos próximos */}
            {hasUpcomingEvents && (
              <div className="absolute top-2 right-2">
                <Badge variant="destructive" className="animate-pulse">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {upcomingAppointments.length + upcomingVaccinations.length}
                </Badge>
              </div>
            )}
          </div>

          <div className="p-4 space-y-3">
            {/* Información básica */}
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{pet.name}</h3>
              <p className="text-sm text-gray-600">{pet.breed}</p>
              <p className="text-xs text-gray-500">{age} • {pet.weight} kg</p>
            </div>

            {/* Próximos eventos */}
            {hasUpcomingEvents && (
              <div className="space-y-2">
                {upcomingAppointments.map(apt => (
                  <div key={apt.id} className="flex items-center space-x-2">
                    <Calendar className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-blue-600">
                      {apt.type} - {new Date(apt.date).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                ))}
                {upcomingVaccinations.map(vacc => (
                  <div key={vacc.id} className="flex items-center space-x-2">
                    <Calendar className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">
                      {vacc.name} - {new Date(vacc.nextDue!).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
