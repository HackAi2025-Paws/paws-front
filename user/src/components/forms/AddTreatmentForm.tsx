import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select } from '../ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { useAppSelector } from '../../hooks'
import type { ConsultationRecord, VaccinationFormData, TreatmentFormData } from '../../types'
import { X, Pill } from 'lucide-react'

interface AddTreatmentFormProps {
  onSubmit: (consultation: Omit<ConsultationRecord, 'id' | 'createdAt'>, vaccinations?: VaccinationFormData[], treatments?: TreatmentFormData[]) => Promise<void>
  onClose: () => void
  selectedPetId?: string
}

export const AddTreatmentForm: React.FC<AddTreatmentFormProps> = ({
  onSubmit,
  onClose,
  selectedPetId
}) => {
  const { pets } = useAppSelector((state) => state.pets)
  
  const [formData, setFormData] = useState({
    petId: selectedPetId || '',
    type: 'tratamiento' as const,
    title: '',
    date: new Date().toISOString().split('T')[0],
    veterinarian: '',
    clinicName: '',
    findings: '',
    notes: '',
    // Campos específicos de tratamiento
    treatmentName: '',
    medication: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    dosage: '',
    frequency: '',
    instructions: '',
    treatmentNotes: ''
  })

  const treatmentTypes = [
    'Antibiótico',
    'Antiinflamatorio',
    'Analgésico',
    'Antiparasitario',
    'Vitaminas/Suplementos',
    'Terapia física',
    'Dieta especial',
    'Otro'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.petId || !formData.treatmentName || !formData.startDate) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    // Estructurar datos como consulta de tratamiento
    const consultationData = {
      petId: formData.petId,
      type: 'tratamiento' as const,
      title: `Tratamiento - ${formData.treatmentName}`,
      date: formData.startDate,
      veterinarian: formData.veterinarian || 'No especificado',
      clinicName: formData.clinicName || 'No especificado',
      findings: `Inicio de tratamiento: ${formData.treatmentName}`,
      diagnosis: formData.medication ? `Medicamento: ${formData.medication}` : 'Tratamiento prescrito',
      nextSteps: formData.endDate ? `Finalizar tratamiento: ${new Date(formData.endDate).toLocaleDateString('es-ES')}` : 'Continuar según indicaciones',
      notes: formData.treatmentNotes || formData.notes,
      nextAppointment: formData.endDate || undefined,
      createdBy: 'owner' as const
    }

    // Datos del tratamiento para crear nested
    const treatmentData = {
      type: formData.treatmentName, // El treatmentName contiene el tipo
      name: formData.treatmentName,
      medication: formData.medication,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      dosage: formData.dosage,
      instructions: formData.instructions || `${formData.frequency ? `Frecuencia: ${formData.frequency}` : ''}`,
      notes: formData.treatmentNotes || ''
    }

    await onSubmit(consultationData, [], [treatmentData])
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Nuevo Tratamiento
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selección de mascota */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mascota *
              </label>
              <Select
                value={formData.petId}
                onChange={(e) => setFormData(prev => ({ ...prev, petId: e.target.value }))}
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

            {/* Información del tratamiento */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información del Tratamiento</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de tratamiento *
                  </label>
                  <Select
                    value={formData.treatmentName}
                    onChange={(e) => setFormData(prev => ({ ...prev, treatmentName: e.target.value }))}
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    {treatmentTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medicamento/Producto
                  </label>
                  <Input
                    value={formData.medication}
                    onChange={(e) => setFormData(prev => ({ ...prev, medication: e.target.value }))}
                    placeholder="ej: Amoxicilina, Rimadyl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de inicio *
                  </label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de finalización
                  </label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dosis
                  </label>
                  <Input
                    value={formData.dosage}
                    onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                    placeholder="ej: 250mg, 1 comprimido"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frecuencia
                  </label>
                  <Select
                    value={formData.frequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                  >
                    <option value="">Seleccionar frecuencia</option>
                    <option value="Cada 8 horas">Cada 8 horas</option>
                    <option value="Cada 12 horas">Cada 12 horas</option>
                    <option value="Una vez al día">Una vez al día</option>
                    <option value="Dos veces al día">Dos veces al día</option>
                    <option value="Tres veces al día">Tres veces al día</option>
                    <option value="Según necesidad">Según necesidad</option>
                    <option value="Otra">Otra</option>
                  </Select>
                </div>
              </div>

              {/* Instrucciones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instrucciones de administración
                </label>
                <Textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                  placeholder="ej: Administrar con comida, aplicar en la zona afectada, etc..."
                  rows={2}
                />
              </div>
            </div>

            {/* Información del veterinario */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información del Veterinario</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Veterinario
                  </label>
                  <Input
                    value={formData.veterinarian}
                    onChange={(e) => setFormData(prev => ({ ...prev, veterinarian: e.target.value }))}
                    placeholder="Dr./Dra. Nombre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Clínica/Hospital
                  </label>
                  <Input
                    value={formData.clinicName}
                    onChange={(e) => setFormData(prev => ({ ...prev, clinicName: e.target.value }))}
                    placeholder="Nombre de la clínica"
                  />
                </div>
              </div>
            </div>

            {/* Notas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas adicionales
              </label>
              <Textarea
                value={formData.treatmentNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, treatmentNotes: e.target.value }))}
                placeholder="Observaciones, efectos secundarios esperados, seguimiento necesario..."
                rows={3}
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                Registrar Tratamiento
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
