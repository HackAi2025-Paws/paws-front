import React, { useState } from 'react'
import { Card, CardContent } from '../ui/card.js'
import { Badge } from '../ui/badge.js'
import { Button } from '../ui/button.js'
import type { Reminder } from '../../types/index.js'
import { useAppDispatch, useAppSelector } from '../../hooks/index.js'
import { completeReminder, updateReminder } from '../../store/remindersSlice.js'
import { petService } from '../../services/petService'
import { formatDate, isUpcoming } from '../../lib/utils.js'
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
  const [completingIds, setCompletingIds] = useState<Set<string>>(new Set())

  const filteredReminders = reminders.filter(r => 
    showCompleted || !r.isCompleted
  )

  const handleCompleteReminder = async (reminderId: string) => {
    try {
      // Evitar doble click
      if (completingIds.has(reminderId)) return
      
      setCompletingIds(prev => new Set(prev).add(reminderId))
      console.log(`🔄 Marking reminder ${reminderId} as completed...`)

      // Llamar al backend para actualizar
      const updatedReminder = await petService.updateReminder(reminderId, {
        isCompleted: true
      })

      // Actualizar Redux con los datos del backend
      dispatch(updateReminder(updatedReminder))
      
      console.log(`✅ Reminder ${reminderId} marked as completed successfully`)
    } catch (error) {
      console.error('❌ Error completing reminder:', error)
      
      // Fallback: actualizar solo Redux si falla el backend
      dispatch(completeReminder(reminderId))
      
      // Notificar al usuario (opcional)
      alert('Recordatorio marcado localmente. Error de conexión con el servidor.')
    } finally {
      setCompletingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(reminderId)
        return newSet
      })
    }
  }

  const getPetName = (petId: string) => {
    const pet = pets.find(p => p.id === petId)
    return pet?.name || 'Mascota'
  }

  if (filteredReminders.length === 0) {
    return null
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
                        disabled={completingIds.has(reminder.id)}
                        className="gap-1 min-w-[80px]"
                      >
                        {completingIds.has(reminder.id) ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                            Marcando...
                          </>
                        ) : (
                          <>
                            <Check className="h-3 w-3" />
                            Marcar
                          </>
                        )}
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
