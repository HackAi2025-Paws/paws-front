import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Calendar, MapPin, Clock, X } from 'lucide-react'
import type { Reminder, ReminderType, Pet } from '../../types/index.js'

interface AddReminderFormProps {
  pets: Pet[]
  onSubmit: (reminder: Omit<Reminder, 'id'>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const REMINDER_TYPES: { value: ReminderType; label: string; icon: string }[] = [
  { value: 'vacuna', label: 'Vacuna', icon: '💉' },
  { value: 'tratamiento', label: 'Tratamiento', icon: '💊' },
  { value: 'control', label: 'Control veterinario', icon: '🩺' },
  { value: 'operacion', label: 'Operación/Cirugía', icon: '⚕️' },
  { value: 'higiene', label: 'Higiene/Baño', icon: '🛁' },
  { value: 'revision', label: 'Revisión general', icon: '🔍' },
  { value: 'estetica', label: 'Estética/Corte', icon: '✂️' }
]

export const AddReminderForm: React.FC<AddReminderFormProps> = ({ 
  pets, 
  onSubmit, 
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    title: '',
    petId: '',
    type: '' as ReminderType | '',
    description: '',
    date: '',
    time: '',
    location: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLoading) return // Prevent double submission
    
    // Validaciones
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio'
    }
    
    if (!formData.petId) {
      newErrors.petId = 'Debe seleccionar una mascota'
    }
    
    if (!formData.type) {
      newErrors.type = 'Debe seleccionar un tipo de consulta'
    }
    
    if (!formData.date) {
      newErrors.date = 'La fecha es obligatoria'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Crear el recordatorio
    const reminder: Omit<Reminder, 'id'> = {
      title: formData.title.trim(),
      petId: formData.petId,
      type: formData.type as ReminderType,
      description: formData.description.trim(),
      date: formData.date,
      time: formData.time,
      location: formData.location.trim(),
      isCompleted: false
    }

    await onSubmit(reminder)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getSelectedPet = () => {
    return pets.find(pet => pet.id === formData.petId)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Nuevo Recordatorio
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="ej: Vacuna antirrábica, Control mensual..."
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title}</p>
              )}
            </div>

            {/* Mascota */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mascota *
              </label>
              <Select
                value={formData.petId}
                onChange={(e) => handleInputChange('petId', e.target.value)}
                className={errors.petId ? 'border-red-500' : ''}
              >
                <option value="">Seleccionar mascota</option>
                {pets.map(pet => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name} ({pet.breed})
                  </option>
                ))}
              </Select>
              {errors.petId && (
                <p className="text-sm text-red-600 mt-1">{errors.petId}</p>
              )}
              
              {getSelectedPet() && (
                <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-blue-800">
                    <span className="text-lg">🐕</span>
                    <span className="font-medium">{getSelectedPet()?.name}</span>
                    <span>•</span>
                    <span>{getSelectedPet()?.breed}</span>
                    <span>•</span>
                    <span>{getSelectedPet()?.age}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Tipo de consulta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de consulta *
              </label>
              <Select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className={errors.type ? 'border-red-500' : ''}
              >
                <option value="">Seleccionar tipo</option>
                {REMINDER_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </Select>
              {errors.type && (
                <p className="text-sm text-red-600 mt-1">{errors.type}</p>
              )}
            </div>

            {/* Fecha y hora */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha *
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className={errors.date ? 'border-red-500' : ''}
                />
                {errors.date && (
                  <p className="text-sm text-red-600 mt-1">{errors.date}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora
                </label>
                <div className="relative">
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                  />
                  <Clock className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ubicación
              </label>
              <div className="relative">
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="ej: Veterinaria San Martín, Av. Libertador 1234"
                />
                <MapPin className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Información adicional sobre el recordatorio..."
                rows={3}
              />
            </div>

            {/* Vista previa del recordatorio */}
            {formData.title && formData.petId && formData.type && formData.date && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Vista previa:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {REMINDER_TYPES.find(t => t.value === formData.type)?.icon}
                    </span>
                    <span className="font-medium">{formData.title}</span>
                  </div>
                  <div className="text-gray-600">
                    Para: <span className="font-medium">{getSelectedPet()?.name}</span>
                  </div>
                  <div className="text-gray-600">
                    📅 {new Date(formData.date).toLocaleDateString('es-ES')}
                    {formData.time && ` a las ${formData.time}`}
                  </div>
                  {formData.location && (
                    <div className="text-gray-600">
                      📍 {formData.location}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
                className="min-w-[140px]"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </>
                ) : (
                  'Crear Recordatorio'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
