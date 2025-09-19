import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select } from '../ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { useAppSelector } from '../../hooks'
import type { ConsultationRecord, VaccinationFormData, TreatmentFormData } from '../../types'
import { X, Calendar, Stethoscope, FileText, DollarSign, MapPin } from 'lucide-react'

interface AddConsultationFormProps {
  onSubmit: (consultation: Omit<ConsultationRecord, 'id' | 'createdAt'>, vaccinations?: VaccinationFormData[], treatments?: TreatmentFormData[]) => Promise<void>
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
    { value: 'control', label: '📋 Control', icon: Calendar },
    { value: 'emergencia', label: '🚨 Emergencia', icon: Stethoscope },
    { value: 'cirugia', label: '⚕️ Cirugía', icon: Stethoscope },
    { value: 'estetica', label: '✂️ Estética', icon: FileText },
    { value: 'revision', label: '🔍 Revisión', icon: Calendar }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.petId || !formData.type || !formData.title) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    const consultation: Omit<ConsultationRecord, 'id' | 'createdAt'> = {
      petId: formData.petId,
      type: formData.type,
      title: formData.title,
      date: formData.date,
      veterinarian: formData.veterinarian,
      clinicName: formData.clinicName,
      findings: formData.findings,
      diagnosis: formData.diagnosis,
      prescription: formData.prescription,
      nextSteps: formData.nextSteps,
      notes: formData.notes,
      cost: formData.cost ? parseFloat(formData.cost) : undefined,
      nextAppointment: formData.nextAppointment || undefined,
      createdBy: 'owner'
    }

    // Solo consulta, sin vacunas ni tratamientos
    await onSubmit(consultation, [], [])
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Nueva Consulta
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
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
                  required
                >
                  <option value="">Seleccionar mascota</option>
                  {pets.map(pet => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} ({pet.species})
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
                  required
                >
                  {consultationTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="ej: Control rutinario, Revisión post-cirugía"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha *
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Información del veterinario */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Información del Veterinario
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Veterinario
                  </label>
                  <Input
                    value={formData.veterinarian}
                    onChange={(e) => handleInputChange('veterinarian', e.target.value)}
                    placeholder="Dr./Dra. Nombre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Clínica/Hospital
                  </label>
                  <Input
                    value={formData.clinicName}
                    onChange={(e) => handleInputChange('clinicName', e.target.value)}
                    placeholder="Nombre de la clínica"
                  />
                </div>
              </div>
            </div>

            {/* Detalles de la consulta */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Stethoscope className="h-5 w-5 mr-2" />
                Detalles de la Consulta
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hallazgos del examen
                </label>
                <Textarea
                  value={formData.findings}
                  onChange={(e) => handleInputChange('findings', e.target.value)}
                  placeholder="Observaciones durante el examen físico..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnóstico
                </label>
                <Textarea
                  value={formData.diagnosis}
                  onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                  placeholder="Diagnóstico del veterinario..."
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prescripción/Tratamiento
                </label>
                <Textarea
                  value={formData.prescription}
                  onChange={(e) => handleInputChange('prescription', e.target.value)}
                  placeholder="Medicamentos prescritos, tratamientos recomendados..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Próximos pasos
                </label>
                <Textarea
                  value={formData.nextSteps}
                  onChange={(e) => handleInputChange('nextSteps', e.target.value)}
                  placeholder="Cuidados en casa, seguimiento necesario..."
                  rows={2}
                />
              </div>
            </div>

            {/* Información adicional */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información Adicional</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <DollarSign className="h-4 w-4 inline mr-1" />
                    Costo
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => handleInputChange('cost', e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Próxima cita
                  </label>
                  <Input
                    type="date"
                    value={formData.nextAppointment}
                    onChange={(e) => handleInputChange('nextAppointment', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas adicionales
                </label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Observaciones adicionales, comportamiento del animal..."
                  rows={3}
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4 border-t">
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