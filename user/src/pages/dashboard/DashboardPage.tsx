import React, { useEffect } from 'react'
import { PetCarousel } from '../../components/features/PetCarousel'
import { PetIllustration } from '../../components/illustrations/PetIllustration'
// Banking style components - using custom CSS classes instead
import { useAppDispatch, useAppSelector } from '../../hooks'
import { loadPets } from '../../store/petsSlice'
import { setReminders } from '../../store/remindersSlice'
import { petService } from '../../services/petService'
import { Calendar, Heart, ChevronRight, Plus } from 'lucide-react'
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
        const reminders = await petService.getPetReminders()
        console.log('📥 Loaded reminders from backend:', reminders)
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

  const upcomingReminders = reminders.filter(r => {
    if (r.isCompleted) return false
    
    // Filtrar solo recordatorios de hoy o futuros
    const reminderDate = new Date(r.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Resetear horas para comparar solo fechas
    
    return reminderDate >= today
  }).slice(0, 3)

  console.log('📊 Total reminders:', reminders.length, 'Upcoming reminders:', upcomingReminders.length)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banking Style Header */}
      <div className="banking-header">
        {/* Balance style section con campanita integrada */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <p className="text-coral-100 text-sm font-medium mb-1">Mis mascotas</p>
            <h1 className="text-3xl font-bold text-white mb-1">
              {pets.length} <span className="text-xl font-normal">🐾</span>
            </h1>
            <p className="text-coral-100 text-sm">
              Hola, {user?.name?.split(' ')[0] || 'Usuario'} 👋
            </p>
          </div>
          
          {/* Iconos del lado derecho */}
          <div className="flex items-center space-x-3">
            <div className="banking-icon-soft">
              <PetIllustration className="w-8 h-8" />
            </div>
          </div>
        </div>
        
      </div>

      {/* Contenido principal */}
      <div className="px-6 py-4 space-y-6">

        {/* Sección de mascotas */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold banking-text-secondary">Mis Mascotas</h2>
            <Link to="/pet/add">
              <button 
                className="flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{ 
                  backgroundColor: '#e25d39',
                  color: 'white'
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </button>
            </Link>
          </div>
          
          {pets.length === 0 ? (
            <div className="banking-card-highlight text-center">
              <div className="banking-icon-soft mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold banking-text-secondary mb-2">
                ¡Agrega tu primera mascota!
              </h3>
              <p className="banking-text-secondary mb-4 text-sm">
                Comienza a cuidar a tus compañeros peludos
              </p>
            </div>
          ) : (
        <PetCarousel pets={pets} />
          )}
        </div>

        {/* Próximos Recordatorios estilo banking */}
        {upcomingReminders.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold banking-text-secondary">Próximos recordatorios</h2>
              <Link to="/reminders">
                <span className="banking-text-primary text-sm font-medium">
                  Ver todos
                  <ChevronRight className="w-4 h-4 inline ml-1" />
                </span>
              </Link>
            </div>

            <div className="banking-balance-card">
              <div className="flex items-center mb-4">
                <div className="banking-icon-coral">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
              
              {upcomingReminders.slice(0, 2).map(reminder => (
                <div key={reminder.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <h3 className="font-medium banking-text-secondary text-sm mb-1">
                      {reminder.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {reminder.description}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xs banking-text-primary font-medium">
                      {new Date(reminder.date).toLocaleDateString('es-ES')}
                    </p>
                    {reminder.time && (
                      <p className="text-xs text-gray-500">
                        {reminder.time}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Beneficios destacados estilo banking */}
        <div>
          <h2 className="text-lg font-semibold banking-text-secondary mb-4">Beneficios destacados</h2>
          <div className="space-y-4">
            <Link to="/faq">
              <div className="banking-card-highlight hover:shadow-lg transition-all duration-200 cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="banking-icon-coral">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold banking-text-secondary text-sm mb-1">
                      ¿Dudas sobre el cuidado de tu mascota?
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      Encontrá respuestas a las preguntas más frecuentes sobre salud y bienestar.
                    </p>
                    <span className="banking-button-secondary text-xs px-3 py-1 inline-block">
                      Ver FAQ
                    </span>
                  </div>
                  <div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </Link>
            
          </div>
        </div>
      </div>
    </div>
  )
}
