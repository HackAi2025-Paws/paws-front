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
    findings: '',
    diagnosis: '',
    prescription: '',
    nextSteps: '',
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
      findings: formData.findings || undefined,
      diagnosis: formData.diagnosis,
      prescription: formData.prescription || undefined,
      nextSteps: formData.nextSteps || undefined,
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
                  placeholder="Veterinario/a"
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

            {/* Sección de hallazgos clínicos */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                📝 Hallazgos Clínicos
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hallazgos (opcional)
                </label>
                <Textarea
                  value={formData.findings}
                  onChange={(e) => handleInputChange('findings', e.target.value)}
                  placeholder="Ej: Ligera inflamación en área metacarpiana. Respuesta de dolor al presionar. Sin heridas visibles."
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  📍 Observaciones físicas, respuestas al examen, hallazgos anormales, etc.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ⚕️ Diagnóstico *
              </label>
              <Textarea
                value={formData.diagnosis}
                onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                placeholder="Ej: Posible esguince o lesión tejidos blandos"
                rows={2}
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Diagnóstico principal o sospecha diagnóstica
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                💊 Tratamiento/Prescripción (opcional)
              </label>
              <Textarea
                value={formData.prescription}
                onChange={(e) => handleInputChange('prescription', e.target.value)}
                placeholder="Ej: Rimadyl 25mg (2 veces/día) + compresas frías"
                rows={2}
              />
              <p className="text-xs text-gray-500 mt-1">
                💊 Medicamentos, dosis, frecuencia y duración del tratamiento
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📅 Próximos pasos (opcional)
              </label>
              <Textarea
                value={formData.nextSteps}
                onChange={(e) => handleInputChange('nextSteps', e.target.value)}
                placeholder="Ej: Reposo 5-7 días, limitar actividad. Control en 1 semana si persiste."
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                📋 Instrucciones de cuidado, seguimiento, restricciones, próximas citas
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ℹ️ Notas adicionales (opcional)
              </label>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Ej: Jugó bruscamente con otro perro en el parque"
                rows={2}
              />
              <p className="text-xs text-gray-500 mt-1">
                📓 Contexto, comportamiento, observaciones adicionales, circunstancias especiales
              </p>
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
