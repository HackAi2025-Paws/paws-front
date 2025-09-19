import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select } from '../ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { useAppSelector } from '../../hooks'
import { petService } from '../../services/petService'
import type { ConsultationRecord, VaccinationFormData, TreatmentFormData, VaccineCatalog } from '../../types'
import { X, Syringe } from 'lucide-react'

interface AddVaccineFormProps {
  onSubmit: (consultation: Omit<ConsultationRecord, 'id' | 'createdAt'>, vaccinations?: VaccinationFormData[], treatments?: TreatmentFormData[]) => Promise<void>
  onClose: () => void
  selectedPetId?: string
}

export const AddVaccineForm: React.FC<AddVaccineFormProps> = ({
  onSubmit,
  onClose,
  selectedPetId
}) => {
  const { pets } = useAppSelector((state) => state.pets)
  const [vaccineCatalog, setVaccineCatalog] = useState<VaccineCatalog[]>([])
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false)
  
  const [formData, setFormData] = useState({
    petId: selectedPetId || '',
    type: 'vacuna' as const,
    title: '',
    date: new Date().toISOString().split('T')[0],
    veterinarian: '',
    clinicName: '',
    findings: '',
    notes: '',
    // Campos específicos de vacuna
    vaccineName: '',
    applicationDate: new Date().toISOString().split('T')[0],
    expirationDate: '',
    batchNumber: '',
    vaccineNotes: ''
  })

  // Cargar catálogo de vacunas dinámicamente
  useEffect(() => {
    const loadVaccineCatalog = async () => {
      setIsLoadingCatalog(true)
      try {
        // Determinar especie de la mascota seleccionada
        const selectedPet = pets.find(p => p.id === formData.petId)
        const species = selectedPet?.species === 'perro' ? 'DOG' : 
                       selectedPet?.species === 'gato' ? 'CAT' : undefined
        
        console.log('🐾 Loading vaccine catalog for species:', species)
        const catalog = await petService.getVaccineCatalog(species)
        setVaccineCatalog(catalog)
        console.log('📋 Loaded vaccine catalog:', catalog)
      } catch (error) {
        console.error('❌ Error loading vaccine catalog:', error)
        // Fallback a opciones básicas si falla
        setVaccineCatalog([
          { id: 1, name: 'Quíntuple (CPV, CDV, CAV-1, CAV-2, CPI)' },
          { id: 3, name: 'Antirrábica' },
          { id: 5, name: 'Triple felina (FPV, FHV-1, FCV)' }
        ])
      } finally {
        setIsLoadingCatalog(false)
      }
    }

    loadVaccineCatalog()
  }, [formData.petId, pets])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.petId || !formData.vaccineName || !formData.applicationDate) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    // Estructurar datos como consulta de vacunación
    const consultationData = {
      petId: formData.petId,
      type: 'vacunacion' as const,
      title: `Vacunación - ${formData.vaccineName}`,
      date: formData.applicationDate,
      veterinarian: formData.veterinarian || 'No especificado',
      clinicName: formData.clinicName || 'No especificado',
      findings: `Aplicación de vacuna: ${formData.vaccineName}`,
      diagnosis: 'Vacunación preventiva',
      nextSteps: formData.expirationDate ? `Próxima vacuna: ${new Date(formData.expirationDate).toLocaleDateString('es-ES')}` : 'Seguir calendario de vacunación',
      notes: formData.vaccineNotes || formData.notes,
      nextAppointment: formData.expirationDate || undefined,
      createdBy: 'owner' as const
    }

    // Datos de la vacuna para crear nested
    const vaccineData = {
      type: formData.vaccineName,
      date: formData.applicationDate,
      expirationDate: formData.expirationDate || undefined,
      batchNumber: formData.batchNumber || undefined,
      veterinarian: formData.veterinarian || 'No especificado',
      notes: formData.vaccineNotes || ''
    }

    await onSubmit(consultationData, [vaccineData], [])
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Syringe className="h-5 w-5" />
              Nueva Vacuna
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

            {/* Información de la vacuna */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información de la Vacuna</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de vacuna *
                  </label>
                  <Select
                    value={formData.vaccineName}
                    onChange={(e) => setFormData(prev => ({ ...prev, vaccineName: e.target.value }))}
                    required
                  >
                    <option value="">
                      {isLoadingCatalog ? 'Cargando vacunas...' : 'Seleccionar vacuna'}
                    </option>
                    {vaccineCatalog.map(vaccine => (
                      <option key={vaccine.id} value={vaccine.name}>
                        {vaccine.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de aplicación *
                  </label>
                  <Input
                    type="date"
                    value={formData.applicationDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, applicationDate: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de vencimiento
                  </label>
                  <Input
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de lote
                  </label>
                  <Input
                    value={formData.batchNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, batchNumber: e.target.value }))}
                    placeholder="ej: L2024001"
                  />
                </div>
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
                value={formData.vaccineNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, vaccineNotes: e.target.value }))}
                placeholder="Reacciones observadas, próximas dosis, etc..."
                rows={3}
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                Registrar Vacuna
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
