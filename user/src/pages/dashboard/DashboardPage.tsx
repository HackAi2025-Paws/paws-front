import React, { useEffect, useState } from 'react'
import { Header } from '../../components/layout/Header'
import { PetCarousel } from '../../components/features/PetCarousel'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { loadPets } from '../../store/petsSlice'
import { setReminders } from '../../store/remindersSlice'
import { petService } from '../../services/petService'
import { Calendar, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { pets } = useAppSelector((state) => state.pets)
  const { reminders } = useAppSelector((state) => state.reminders)
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        console.log('🏠 Loading dashboard data...')
        
        // Cargar pets reales del backend (si no hay pets cargados)
        if (pets.length === 0) {
          dispatch(loadPets())
        }
        
        // Cargar recordatorios reales del backend
        const reminders = await petService.getPetReminders('dummy')
        dispatch(setReminders(reminders))
        
        console.log('✅ Dashboard data loaded successfully')
      } catch (error) {
        console.error('❌ Error loading dashboard data:', error)
        // En caso de error, al menos intentar cargar los pets
        if (pets.length === 0) {
          dispatch(loadPets())
        }
        dispatch(setReminders([])) // Array vacío en lugar de mock
      }
    }

    loadDashboardData()
  }, [dispatch, pets.length])

  const upcomingReminders = reminders.filter(r => !r.isCompleted).slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={`Hola, ${user?.name?.split(' ')[0] || 'Usuario'}`} showBack={false} />
      
      <div className="p-4 space-y-6">
        {/* Carrusel de mascotas - PRIMERO */}
        <PetCarousel pets={pets} />

        {/* Sección de recordatorios importantes - SEGUNDO */}
        {upcomingReminders.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center text-orange-800">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Recordatorios Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcomingReminders.map(reminder => (
                <div key={reminder.id} className="flex items-start space-x-3 p-2 bg-white rounded-lg">
                  <Calendar className="h-4 w-4 text-orange-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{reminder.title}</p>
                    <p className="text-xs text-gray-600">{reminder.description}</p>
                    <p className="text-xs text-orange-600 mt-1">
                      {new Date(reminder.date).toLocaleDateString('es-ES')}
                      {reminder.time && ` a las ${reminder.time}`}
                    </p>
                    {reminder.location && (
                      <p className="text-xs text-gray-500 mt-1">
                        📍 {reminder.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              <Link to="/reminders">
                <Button variant="outline" size="sm" className="w-full mt-2">
                  Ver todos los recordatorios
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
