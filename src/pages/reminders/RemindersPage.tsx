import React, { useState } from 'react'
import { Header } from '../../components/layout/Header'
import { ReminderList } from '../../components/features/ReminderList'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { useAppSelector } from '../../hooks'
import { Plus, Filter } from 'lucide-react'

export const RemindersPage: React.FC = () => {
  const { reminders } = useAppSelector((state) => state.reminders)
  const [showCompleted, setShowCompleted] = useState(false)

  const pendingReminders = reminders.filter(r => !r.isCompleted)
  const completedReminders = reminders.filter(r => r.isCompleted)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Recordatorios" showBack={false} />
      
      <div className="p-4 space-y-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="flex items-center justify-center py-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{pendingReminders.length}</p>
                <p className="text-xs text-gray-600">Pendientes</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-center py-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{completedReminders.length}</p>
                <p className="text-xs text-gray-600">Completados</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controles */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant={!showCompleted ? "default" : "outline"}
              size="sm"
              onClick={() => setShowCompleted(false)}
            >
              Pendientes ({pendingReminders.length})
            </Button>
            <Button
              variant={showCompleted ? "default" : "outline"}
              size="sm"
              onClick={() => setShowCompleted(true)}
            >
              Completados ({completedReminders.length})
            </Button>
          </div>
          
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo
          </Button>
        </div>

        {/* Lista de recordatorios */}
        <div>
          <ReminderList 
            reminders={showCompleted ? completedReminders : pendingReminders}
            showCompleted={showCompleted}
          />
        </div>

        {/* Acceso rápido a agregar recordatorio */}
        {!showCompleted && pendingReminders.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">¡Perfecto!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                No tienes recordatorios pendientes. Puedes agregar uno nuevo cuando lo necesites.
              </p>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Agregar Recordatorio
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
