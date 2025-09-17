import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select } from '../ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { useAppSelector } from '../../hooks'
import type { ConsultationRecord } from '../../types/index.js'
import { X, Calendar, Stethoscope, FileText, DollarSign, MapPin } from 'lucide-react'

interface AddConsultationFormProps {
  onSubmit: (consultation: Omit<ConsultationRecord, 'id' | 'createdAt'>) => void
  onClose: () => void
  selectedPetId?: string
}

export const AddConsultationForm: React.FC<AddConsultationFormProps> = ({
  onSubmit,
  onClose,
  selectedPetId
}) => {
  const { pets } = useAppSelector((state) => state.pets)
  
  const [formData, setFormData] = useState({
    petId: selectedPetId || '',
    type: 'consulta' as ConsultationRecord['type'],
    title: '',
    date: new Date().toISOString().split('T')[0],
    veterinarian: '',
    clinicName: '',
    diagnosis: '',
    prescription: '',
    notes: '',
    cost: '',
    nextAppointment: ''
  })

  const consultationTypes = [
    { value: 'consulta', label: '🩺 Consulta General', icon: Stethoscope },
    { value: 'vacunacion', label: '💉 Vacunación', icon: Stethoscope },
    { value: 'tratamiento', label: '💊 Tratamiento', icon: FileText },
    { value: 'control', label: '📋 Control', icon: Calendar },
    { value: 'emergencia', label: '🚨 Emergencia', icon: Stethoscope },
    { value: 'cirugia', label: '⚕️ Cirugía', icon: Stethoscope },
    { value: 'estetica', label: '✂️ Estética', icon: FileText },
    { value: 'revision', label: '🔍 Revisión', icon: Calendar }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.petId || !formData.title || !formData.diagnosis) {
      alert('Por favor completa los campos obligatorios: Mascota, Título y Diagnóstico')
      return
    }

    const consultationData: Omit<ConsultationRecord, 'id' | 'createdAt'> = {
      petId: formData.petId,
      type: formData.type,
      title: formData.title,
      date: formData.date,
      veterinarian: formData.veterinarian || undefined,
      clinicName: formData.clinicName || undefined,
      diagnosis: formData.diagnosis,
      prescription: formData.prescription || undefined,
      notes: formData.notes || undefined,
      cost: formData.cost ? parseFloat(formData.cost) : undefined,
      nextAppointment: formData.nextAppointment || undefined,
      createdBy: 'owner'
    }

    onSubmit(consultationData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Registrar Consulta
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mascota *
                </label>
                <Select
                  value={formData.petId}
                  onChange={(e) => handleInputChange('petId', e.target.value)}
                  disabled={!!selectedPetId}
                >
                  <option value="">Seleccionar mascota</option>
                  {pets.map(pet => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} ({pet.breed})
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de consulta *
                </label>
                <Select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                >
                  {consultationTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título de la consulta *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ej: Control rutinario, Problema digestivo, Vacuna anual..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Fecha de la consulta *
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <DollarSign className="h-4 w-4 inline mr-1" />
                  Costo (opcional)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => handleInputChange('cost', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Veterinario (opcional)
                </label>
                <Input
                  type="text"
                  value={formData.veterinarian}
                  onChange={(e) => handleInputChange('veterinarian', e.target.value)}
                  placeholder="Dr. Martínez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Clínica/Hospital (opcional)
                </label>
                <Input
                  type="text"
                  value={formData.clinicName}
                  onChange={(e) => handleInputChange('clinicName', e.target.value)}
                  placeholder="Veterinaria San Martín"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diagnóstico *
              </label>
              <Textarea
                value={formData.diagnosis}
                onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                placeholder="Describe el diagnóstico del veterinario o tus observaciones sobre el estado de salud de tu mascota..."
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Incluye síntomas observados, resultado de exámenes, estado general, etc.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prescripción/Tratamiento (opcional)
              </label>
              <Textarea
                value={formData.prescription}
                onChange={(e) => handleInputChange('prescription', e.target.value)}
                placeholder="Medicamentos recetados, dosis, duración del tratamiento..."
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas adicionales (opcional)
              </label>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Comportamiento durante la consulta, recomendaciones especiales, observaciones..."
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="h-4 w-4 inline mr-1" />
                Próxima cita (opcional)
              </label>
              <Input
                type="date"
                value={formData.nextAppointment}
                onChange={(e) => handleInputChange('nextAppointment', e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Guardar Consulta
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
