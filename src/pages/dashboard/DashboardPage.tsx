import React, { useEffect } from 'react'
import { Header } from '../../components/layout/Header'
import { PetCard } from '../../components/features/PetCard'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { setPets } from '../../store/petsSlice'
import { setReminders } from '../../store/remindersSlice'
import { mockPets, mockReminders } from '../../data/mockData'
import { Plus, Calendar, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { pets } = useAppSelector((state) => state.pets)
  const { reminders } = useAppSelector((state) => state.reminders)
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    // Cargar datos mock
    dispatch(setPets(mockPets))
    dispatch(setReminders(mockReminders))
  }, [dispatch])

  const upcomingReminders = reminders.filter(r => !r.isCompleted).slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={`Hola, ${user?.name?.split(' ')[0] || 'Usuario'}`} showBack={false} />
      
      <div className="p-4 space-y-6">
        {/* Sección de recordatorios urgentes */}
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
                    </p>
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

        {/* Sección de mascotas */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Mis Mascotas</h2>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar
            </Button>
          </div>

          {pets.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-6xl mb-4">🐕</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  ¡Agrega tu primera mascota!
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  Comienza a llevar un registro completo del cuidado de tus mascotas
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Mascota
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {pets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          )}
        </div>

        {/* Accesos rápidos */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Accesos Rápidos</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/chat">
              <Card className="transition-all hover:shadow-md">
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <div className="text-3xl mb-2">💬</div>
                  <p className="text-sm font-medium text-center">Chat con Veterinario</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/faq">
              <Card className="transition-all hover:shadow-md">
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <div className="text-3xl mb-2">❓</div>
                  <p className="text-sm font-medium text-center">Preguntas Frecuentes</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
