import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import type { Reminder } from '../../types/index.js'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { completeReminder } from '../../store/remindersSlice'
import { formatDate, isUpcoming } from '../../lib/utils'
import { Calendar, Syringe, Pill, Stethoscope, Check, Clock } from 'lucide-react'

interface ReminderListProps {
  reminders: Reminder[]
  showCompleted?: boolean
}

const getIconForType = (type: Reminder['type']) => {
  switch (type) {
    case 'vacuna':
      return Syringe
    case 'control':
    case 'revision':
      return Stethoscope
    case 'tratamiento':
    case 'medicacion':
      return Pill
    case 'operacion':
      return Calendar
    case 'higiene':
      return Clock
    case 'desparasitacion':
      return Pill
    case 'estetica':
      return Clock
    case 'emergencia':
      return Calendar
    default:
      return Clock
  }
}

const getColorForType = (type: Reminder['type']) => {
  switch (type) {
    case 'vacuna':
      return 'text-green-500'
    case 'control':
    case 'revision':
      return 'text-blue-500'
    case 'tratamiento':
    case 'medicacion':
      return 'text-purple-500'
    case 'operacion':
      return 'text-red-500'
    case 'higiene':
    case 'estetica':
      return 'text-cyan-500'
    case 'desparasitacion':
      return 'text-yellow-500'
    case 'emergencia':
      return 'text-red-600'
    default:
      return 'text-gray-500'
  }
}

const getTypeLabel = (type: Reminder['type']) => {
  const labels = {
    'vacuna': '💉 Vacuna',
    'tratamiento': '💊 Tratamiento',
    'control': '🩺 Control',
    'operacion': '⚕️ Operación',
    'higiene': '🛁 Higiene',
    'desparasitacion': '🐛 Desparasitación',
    'revision': '🔍 Revisión',
    'estetica': '✂️ Estética',
    'emergencia': '🚨 Emergencia',
    'medicacion': '💊 Medicación'
  }
  return labels[type] || type
}

export const ReminderList: React.FC<ReminderListProps> = ({ 
  reminders, 
  showCompleted = false 
}) => {
  const dispatch = useAppDispatch()
  const { pets } = useAppSelector((state) => state.pets)

  const filteredReminders = reminders.filter(r => 
    showCompleted || !r.isCompleted
  )

  const handleCompleteReminder = (reminderId: string) => {
    dispatch(completeReminder(reminderId))
  }

  const getPetName = (petId: string) => {
    const pet = pets.find(p => p.id === petId)
    return pet?.name || 'Mascota'
  }

  if (filteredReminders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {showCompleted ? 'No hay recordatorios completados' : '¡Todo al día!'}
          </h3>
          <p className="text-gray-600 text-center">
            {showCompleted 
              ? 'Cuando completes recordatorios aparecerán aquí'
              : 'No tienes recordatorios pendientes en este momento'
            }
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {filteredReminders.map((reminder) => {
        const Icon = getIconForType(reminder.type)
        const iconColor = getColorForType(reminder.type)
        const isUrgent = !reminder.isCompleted && isUpcoming(reminder.date)
        const isPast = !reminder.isCompleted && new Date(reminder.date) < new Date()

        return (
          <Card 
            key={reminder.id} 
            className={`
              ${reminder.isCompleted ? 'opacity-60' : ''}
              ${isUrgent ? 'border-orange-200 bg-orange-50' : ''}
              ${isPast ? 'border-red-200 bg-red-50' : ''}
            `}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className={`mt-1 ${iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-medium ${reminder.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {reminder.title}
                      </h3>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {getTypeLabel(reminder.type)}
                      </span>
                    </div>
                    {reminder.description && (
                      <p className="text-sm text-gray-600">{reminder.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="font-medium">
                        🐕 {getPetName(reminder.petId)}
                      </span>
                      {reminder.time && (
                        <span>
                          🕐 {reminder.time}
                        </span>
                      )}
                      {reminder.location && (
                        <span>
                          📍 {reminder.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={
                          reminder.isCompleted ? 'default' :
                          isPast ? 'destructive' :
                          isUrgent ? 'secondary' : 'outline'
                        }
                      >
                        {reminder.isCompleted ? 'Completado' :
                         isPast ? 'Vencido' :
                         isUrgent ? 'Próximo' : formatDate(reminder.date)}
                      </Badge>
                      
                      {!reminder.isCompleted && (
                        <span className="text-xs text-gray-500">
                          {formatDate(reminder.date)}
                        </span>
                      )}
                    </div>

                    {!reminder.isCompleted && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCompleteReminder(reminder.id)}
                        className="gap-1"
                      >
                        <Check className="h-3 w-3" />
                        Marcar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
