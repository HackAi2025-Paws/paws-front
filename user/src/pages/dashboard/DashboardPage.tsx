import React, { useEffect } from 'react'
import { PetCarousel } from '../../components/features/PetCarousel'
import { PetIllustration } from '../../components/illustrations/PetIllustration'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { loadPets } from '../../store/petsSlice'
import { setReminders } from '../../store/remindersSlice'
import { petService } from '../../services/petService'
import { Calendar, Heart, TrendingUp, ChevronRight, Stethoscope, Plus } from 'lucide-react'
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
    <div className="min-h-screen bg-cream-400">
      {/* Hero Section con Ilustración */}
      <div className="relative overflow-hidden bg-red-500 px-6 pt-8 pb-6">
        {/* Ilustración de fondo */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Formas decorativas simples */}
            <circle cx="20" cy="20" r="8" fill="currentColor" opacity="0.3"/>
            <path d="M40 10 Q50 20 60 10 Q50 30 40 10" fill="currentColor" opacity="0.2"/>
            <circle cx="70" cy="30" r="5" fill="currentColor" opacity="0.4"/>
          </svg>
        </div>
        
        {/* Ilustración principal estilo mascota */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">
              Hola, {user?.name?.split(' ')[0] || 'Usuario'} 👋
            </h1>
            <p className="text-white/90 text-base">
              ¿Qué te gustaría hacer hoy?
            </p>
          </div>
          
          {/* Ilustración de mascota */}
          <PetIllustration className="w-28 h-28" />
        </div>

      </div>

      {/* Contenido principal */}
      <div className="px-6 py-6 space-y-6">
        {/* Sección de mascotas */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-dark-900">Mis Mascotas</h2>
            <Link to="/pet/add">
              <Button variant="ghost" size="sm" className="text-red-600">
                <Plus className="w-4 h-4 mr-1" />
                Agregar
              </Button>
            </Link>
          </div>
          
          {pets.length === 0 ? (
            <Card className="text-center p-8">
              <Heart className="w-12 h-12 text-red-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-dark-900 mb-2">
                ¡Agrega tu primera mascota!
              </h3>
              <p className="text-dark-500 mb-4">
                Comienza a cuidar a tus compañeros peludos
              </p>
              <Link to="/pet/add">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Mascota
                </Button>
              </Link>
            </Card>
          ) : (
            <PetCarousel pets={pets} />
          )}
        </div>

        {/* Recordatorios importantes */}
        {upcomingReminders.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-dark-900 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-red-500" />
                Próximos
              </h2>
              <Link to="/reminders">
                <Button variant="ghost" size="sm" className="text-red-600">
                  ver todo
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <Card className="bg-pink-100 border-red-200">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {upcomingReminders.slice(0, 1).map(reminder => (
                    <div key={reminder.id} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-dark-900 text-base">
                          {reminder.title}
                        </h3>
                        <p className="text-dark-600 text-sm line-clamp-2">
                          {reminder.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {new Date(reminder.date).toLocaleDateString('es-ES')}
                          </Badge>
                          {reminder.time && (
                            <Badge variant="outline" className="text-xs">
                              {reminder.time}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {upcomingReminders.length > 1 && (
                  <div className="mt-4 pt-3 border-t border-red-200">
                    <p className="text-sm text-dark-600">
                      +{upcomingReminders.length - 1} recordatorios más
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Acciones rápidas */}
        <div>
          <h2 className="text-xl font-semibold text-dark-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/consultations">
              <Card className="bg-pink-200 border-pink-300 hover:shadow-md transition-all">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-medium text-dark-900 text-sm">Nueva Consulta</h3>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/reminders">
              <Card className="bg-orange-200 border-orange-300 hover:shadow-md transition-all">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-medium text-dark-900 text-sm">Recordatorio</h3>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
