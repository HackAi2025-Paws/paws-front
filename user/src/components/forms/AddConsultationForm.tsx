import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select } from '../ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { useAppSelector } from '../../hooks'
import type { ConsultationRecord, VaccinationType } from '../../types/index.js'
import { X, Calendar, Stethoscope, FileText, DollarSign, MapPin, Plus, Syringe, Pill } from 'lucide-react'

interface AddConsultationFormProps {
  onSubmit: (consultation: Omit<ConsultationRecord, 'id' | 'createdAt'>, vaccinations?: any[], treatments?: any[]) => Promise<void>
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

  const VACCINATION_OPTIONS: VaccinationType[] = [
    'Rabia',
    'DHPP (Múltiple)',
    'Parvovirus',
    'Moquillo',
    'Hepatitis',
    'Parainfluenza',
    'Coronavirus',
    'Leptospirosis',
    'Bordetella',
    'Giardia',
    'Leishmaniosis',
    'Pentavalente',
    'Sextuple',
    'Triple felina',
    'Leucemia felina'
  ]

  const TREATMENT_TYPES = [
    'Antibiótico',
    'Antiinflamatorio',
    'Analgésico',
    'Antiparasitario',
    'Vitaminas',
    'Suplemento',
    'Antihistamínico',
    'Corticoide',
    'Probiótico',
    'Desparasitante',
    'Otro'
  ] as const

  // Estado para vacunas y tratamientos
  const [vaccinations, setVaccinations] = useState<Array<{
    type: VaccinationType | ''
    date: string
    veterinarian: string
    batchNumber: string
    expirationDate: string
    notes: string
  }>>([])

  const [treatments, setTreatments] = useState<Array<{
    type: typeof TREATMENT_TYPES[number] | ''
    name: string
    startDate: string
    endDate: string
    dosage: string
    instructions: string
    veterinarian: string
  }>>([])

  // Funciones para manejar vacunas
  const addVaccination = () => {
    setVaccinations(prev => [...prev, { 
      type: '', 
      date: '', 
      veterinarian: '', 
      batchNumber: '', 
      expirationDate: '', 
      notes: '' 
    }])
  }

  const removeVaccination = (index: number) => {
    setVaccinations(prev => prev.filter((_, i) => i !== index))
  }

  const updateVaccination = (index: number, field: string, value: string) => {
    setVaccinations(prev => prev.map((vaccination, i) => 
      i === index ? { ...vaccination, [field]: value } : vaccination
    ))
  }

  // Funciones para manejar tratamientos
  const addTreatment = () => {
    setTreatments(prev => [...prev, { 
      type: '', 
      name: '', 
      startDate: '', 
      endDate: '', 
      dosage: '', 
      instructions: '', 
      veterinarian: '' 
    }])
  }

  const removeTreatment = (index: number) => {
    setTreatments(prev => prev.filter((_, i) => i !== index))
  }

  const updateTreatment = (index: number, field: string, value: string) => {
    setTreatments(prev => prev.map((treatment, i) => 
      i === index ? { ...treatment, [field]: value } : treatment
    ))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.petId || !formData.title || !formData.diagnosis) {
      alert('Por favor completa los campos obligatorios: Mascota, Título y Diagnóstico')
      return
    }

    // Validación específica por tipo de consulta
    if (formData.type === 'vacunacion' && vaccinations.length === 0) {
      alert('Para consultas de vacunación debe agregar al menos una vacuna')
      return
    }
    
    if (formData.type === 'tratamiento' && treatments.length === 0) {
      alert('Para consultas de tratamiento debe agregar al menos un tratamiento')
      return
    }

    // Validar vacunas requeridas
    for (let i = 0; i < vaccinations.length; i++) {
      const vaccination = vaccinations[i]
      if (!vaccination.type || !vaccination.date) {
        alert(`Vacuna #${i + 1}: Tipo y fecha son obligatorios`)
        return
      }
    }

    // Validar tratamientos requeridos
    for (let i = 0; i < treatments.length; i++) {
      const treatment = treatments[i]
      if (!treatment.type || !treatment.name || !treatment.startDate || !treatment.dosage || !treatment.instructions) {
        alert(`Tratamiento #${i + 1}: Tipo, nombre, fecha de inicio, dosis e instrucciones son obligatorios`)
        return
      }
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

    await onSubmit(consultationData, vaccinations, treatments)
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

            {/* Sección de Vacunas - Mostrar solo si el tipo es 'vacunacion' o siempre */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Syringe className="h-5 w-5 mr-2" />
              Vacunas Aplicadas
              {formData.type === 'vacunacion' && <span className="text-red-500 ml-1">*</span>}
            </h3>
            <Button type="button" onClick={addVaccination} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Vacuna
            </Button>
          </div>
          
          {formData.type === 'vacunacion' && vaccinations.length === 0 && (
            <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
              ⚠️ Para consultas de tipo "Vacunación" es obligatorio agregar al menos una vacuna
            </p>
          )}

              {vaccinations.map((vaccination, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3 bg-blue-50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">💉 Vacuna #{index + 1}</span>
                    <Button
                      type="button"
                      onClick={() => removeVaccination(index)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de vacuna *
                      </label>
                      <Select
                        value={vaccination.type}
                        onChange={(e) => updateVaccination(index, 'type', e.target.value)}
                      >
                        <option value="">Seleccionar vacuna</option>
                        {VACCINATION_OPTIONS.map(vaccine => (
                          <option key={vaccine} value={vaccine}>{vaccine}</option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de aplicación *
                      </label>
                      <Input
                        type="date"
                        value={vaccination.date}
                        onChange={(e) => updateVaccination(index, 'date', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Veterinario
                      </label>
                      <Input
                        value={vaccination.veterinarian}
                        onChange={(e) => updateVaccination(index, 'veterinarian', e.target.value)}
                        placeholder="Dr./Dra."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de lote
                      </label>
                      <Input
                        value={vaccination.batchNumber}
                        onChange={(e) => updateVaccination(index, 'batchNumber', e.target.value)}
                        placeholder="Lote"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de expiración
                      </label>
                      <Input
                        type="date"
                        value={vaccination.expirationDate}
                        onChange={(e) => updateVaccination(index, 'expirationDate', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notas
                      </label>
                      <Input
                        value={vaccination.notes}
                        onChange={(e) => updateVaccination(index, 'notes', e.target.value)}
                        placeholder="Observaciones adicionales"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {vaccinations.length === 0 && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                  <Syringe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay vacunas registradas para esta consulta</p>
                  <p className="text-sm">Haz clic en "Agregar Vacuna" si se aplicaron vacunas</p>
                </div>
              )}
            </div>

            {/* Sección de Tratamientos */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Pill className="h-5 w-5 mr-2" />
              Tratamientos Prescritos
              {formData.type === 'tratamiento' && <span className="text-red-500 ml-1">*</span>}
            </h3>
            <Button type="button" onClick={addTreatment} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Tratamiento
            </Button>
          </div>
          
          {formData.type === 'tratamiento' && treatments.length === 0 && (
            <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
              ⚠️ Para consultas de tipo "Tratamiento" es obligatorio agregar al menos un tratamiento
            </p>
          )}

              {treatments.map((treatment, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3 bg-green-50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">💊 Tratamiento #{index + 1}</span>
                    <Button
                      type="button"
                      onClick={() => removeTreatment(index)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de tratamiento *
                      </label>
                      <Select
                        value={treatment.type}
                        onChange={(e) => updateTreatment(index, 'type', e.target.value)}
                      >
                        <option value="">Seleccionar tipo</option>
                        {TREATMENT_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del medicamento *
                      </label>
                      <Input
                        value={treatment.name}
                        onChange={(e) => updateTreatment(index, 'name', e.target.value)}
                        placeholder="Ej: Amoxicilina, Rimadyl..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de inicio *
                      </label>
                      <Input
                        type="date"
                        value={treatment.startDate}
                        onChange={(e) => updateTreatment(index, 'startDate', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de fin
                      </label>
                      <Input
                        type="date"
                        value={treatment.endDate}
                        onChange={(e) => updateTreatment(index, 'endDate', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dosis *
                      </label>
                      <Input
                        value={treatment.dosage}
                        onChange={(e) => updateTreatment(index, 'dosage', e.target.value)}
                        placeholder="Ej: 250mg, 1 comprimido..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Veterinario
                      </label>
                      <Input
                        value={treatment.veterinarian}
                        onChange={(e) => updateTreatment(index, 'veterinarian', e.target.value)}
                        placeholder="Dr./Dra."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instrucciones de administración *
                    </label>
                    <Textarea
                      value={treatment.instructions}
                      onChange={(e) => updateTreatment(index, 'instructions', e.target.value)}
                      placeholder="Ej: Cada 12 horas con comida. Completar todo el tratamiento..."
                      rows={2}
                    />
                  </div>
                </div>
              ))}

              {treatments.length === 0 && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                  <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay tratamientos registrados para esta consulta</p>
                  <p className="text-sm">Haz clic en "Agregar Tratamiento" si se prescribieron medicamentos</p>
                </div>
              )}
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
