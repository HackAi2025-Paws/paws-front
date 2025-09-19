import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Tooltip } from '../ui/tooltip'
import { Badge } from '../ui/badge'
import { 
  Camera, 
  Plus, 
  X, 
  Upload, 
  HelpCircle,
  Calendar,
  Syringe,
  FileText
} from 'lucide-react'
import type { Pet, VaccinationType, Treatment, PetDocument } from '../../types/index.js'

interface AddPetFormProps {
  onSubmit: (pet: Omit<Pet, 'id'>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const VACCINATION_OPTIONS: VaccinationType[] = [
  'Rabia',
  'DHPP (Múltiple)',
  'Parvovirus',
  'Moquillo',
  'Hepatitis',
  'Parainfluenza',
  'Bordetella',
  'Leptospirosis',
  'Lyme',
  'Triple Felina (FVRCP)',
  'Leucemia Felina (FeLV)',
  'Panleucopenia',
  'Rinotraqueitis',
  'Calicivirus',
  'Otra'
]

const TREATMENT_TYPES = [
  'inyeccion',
  'tratamiento',
  'antiparasitario',
  'medicamento'
] as const

const DOCUMENT_TYPES = [
  'radiografia',
  'ecografia',
  'analisis',
  'certificado',
  'otros'
] as const

const NOTES_HELP_CONTENT = (
  <div className="text-left">
    <p className="font-medium mb-2">¿Qué incluir en las notas?</p>
    <ul className="space-y-1 text-xs">
      <li>• Comportamiento habitual</li>
      <li>• Preferencias alimentarias</li>
      <li>• Alergias conocidas</li>
      <li>• Miedos o fobias</li>
      <li>• Relación con otros animales</li>
      <li>• Actividades favoritas</li>
      <li>• Problemas de salud crónicos</li>
    </ul>
  </div>
)

const OBSERVATIONS_HELP_CONTENT = (
  <div className="text-left">
    <p className="font-medium mb-2">Observaciones importantes:</p>
    <ul className="space-y-1 text-xs">
      <li>• Cambios recientes en comportamiento</li>
      <li>• Síntomas específicos</li>
      <li>• Reacciones a medicamentos</li>
      <li>• Problemas físicos visibles</li>
      <li>• Cambios en apetito/sueño</li>
      <li>• Situaciones de estrés</li>
    </ul>
  </div>
)

export const AddPetForm: React.FC<AddPetFormProps> = ({ onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    species: '' as 'perro' | 'gato' | '',
    birthDate: '',
    weightMin: '',
    weightMax: '',
    weightUnit: 'kg' as 'kg' | 'lbs',
    gender: '' as 'macho' | 'hembra' | '',
    photo: null as File | null,
    notes: '',
    observations: ''
  })

  const [vaccinations, setVaccinations] = useState<Array<{
    name: VaccinationType | ''
    date: string
    veterinarian: string
  }>>([])

  const [treatments, setTreatments] = useState<Array<{
    type: typeof TREATMENT_TYPES[number] | ''
    name: string
    date: string
    dose: string
  }>>([])

  const [documents, setDocuments] = useState<Array<{
    name: string
    type: typeof DOCUMENT_TYPES[number] | ''
    file: File | null
  }>>([])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido')
        return
      }
      
      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB.')
        return
      }
      
      setFormData(prev => ({ ...prev, photo: file }))
    }
    // Reset input value para permitir seleccionar el mismo archivo nuevamente
    e.target.value = ''
  }

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, photo: null }))
  }

  const addVaccination = () => {
    setVaccinations(prev => [...prev, { name: '', date: '', veterinarian: '' }])
  }

  const removeVaccination = (index: number) => {
    setVaccinations(prev => prev.filter((_, i) => i !== index))
  }

  const updateVaccination = (index: number, field: string, value: string) => {
    setVaccinations(prev => prev.map((v, i) => 
      i === index ? { ...v, [field]: value } : v
    ))
  }

  const addTreatment = () => {
    setTreatments(prev => [...prev, { type: '', name: '', date: '', dose: '' }])
  }

  const removeTreatment = (index: number) => {
    setTreatments(prev => prev.filter((_, i) => i !== index))
  }

  const updateTreatment = (index: number, field: string, value: string) => {
    setTreatments(prev => prev.map((t, i) => 
      i === index ? { ...t, [field]: value } : t
    ))
  }

  const addDocument = () => {
    setDocuments(prev => [...prev, { name: '', type: '', file: null }])
  }

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index))
  }

  const updateDocument = (index: number, field: string, value: string | File) => {
    setDocuments(prev => prev.map((d, i) => 
      i === index ? { ...d, [field]: value } : d
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLoading) return // Prevent double submission
    
    // Validaciones básicas
    if (!formData.name || !formData.breed || !formData.species || !formData.birthDate || !formData.gender) {
      alert('Por favor completa todos los campos obligatorios: Nombre, Raza, Especie, Fecha de nacimiento y Género')
      return
    }

    const pet: Omit<Pet, 'id'> = {
      name: formData.name,
      breed: formData.breed,
      species: formData.species,
      birthDate: formData.birthDate,
      age: calculateAge(formData.birthDate),
      weight: {
        min: Number(formData.weightMin) || 0,
        max: Number(formData.weightMax) || Number(formData.weightMin) || 0,
        unit: formData.weightUnit
      },
      gender: formData.gender,
      photo: formData.photo ? URL.createObjectURL(formData.photo) : undefined,
      notes: formData.notes,
      observations: formData.observations,
      ownerId: '1', // TODO: Get from auth state
      vaccinations: vaccinations
        .filter(v => v.name && v.date)
        .map((v, index) => ({
          id: `vac-${Date.now()}-${index}`,
          petId: '', // Will be set after pet creation
          name: v.name as VaccinationType,
          date: v.date,
          veterinarian: v.veterinarian,
        })),
      treatments: treatments
        .filter(t => t.name && t.date)
        .map((t, index) => ({
          id: `treat-${Date.now()}-${index}`,
          petId: '',
          type: t.type as Treatment['type'],
          name: t.name,
          date: t.date,
          dose: t.dose,
        })),
      appointments: [],
      documents: documents
        .filter(d => d.name && d.type)
        .map((d, index) => ({
          id: `doc-${Date.now()}-${index}`,
          petId: '',
          name: d.name,
          type: d.type as PetDocument['type'],
          uploadDate: new Date().toISOString(),
          fileSize: d.file?.size,
        })),
      consultationRecords: []
    }

    await onSubmit(pet)
  }

  const calculateAge = (birthDate: string): string => {
    const birth = new Date(birthDate)
    const now = new Date()
    const diffMonths = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth()
    
    if (diffMonths < 12) {
      return `${diffMonths} meses`
    } else {
      const years = Math.floor(diffMonths / 12)
      return `${years} año${years > 1 ? 's' : ''}`
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Registrar Nueva Mascota
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
              
              {/* Foto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto de la mascota
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    {formData.photo ? (
                      <>
                        <img 
                          src={URL.createObjectURL(formData.photo)} 
                          alt="Preview" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </>
                    ) : (
                      <Camera className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label 
                      htmlFor="photo-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      Subir Foto
                    </label>
                    <p className="text-xs text-gray-500">
                      Máximo 5MB. Formatos: JPG, PNG, GIF
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nombre de la mascota"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Raza *
                  </label>
                  <Input
                    value={formData.breed}
                    onChange={(e) => setFormData(prev => ({ ...prev, breed: e.target.value }))}
                    placeholder="Raza o mezcla"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especie *
                  </label>
                  <Select
                    value={formData.species}
                    onChange={(e) => setFormData(prev => ({ ...prev, species: e.target.value as 'perro' | 'gato' }))}
                    required
                  >
                    <option value="">Seleccionar especie</option>
                    <option value="perro">🐕 Perro</option>
                    <option value="gato">🐱 Gato</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de nacimiento *
                  </label>
                  <Input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sexo *
                  </label>
                  <Select
                    value={formData.gender}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as 'macho' | 'hembra' }))}
                    required
                  >
                    <option value="">Seleccionar</option>
                    <option value="macho">Macho</option>
                    <option value="hembra">Hembra</option>
                  </Select>
                </div>
              </div>

              {/* Peso */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (rango)
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.weightMin}
                    onChange={(e) => setFormData(prev => ({ ...prev, weightMin: e.target.value }))}
                    placeholder="Min"
                    className="w-20"
                  />
                  <span className="text-gray-500">-</span>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.weightMax}
                    onChange={(e) => setFormData(prev => ({ ...prev, weightMax: e.target.value }))}
                    placeholder="Max"
                    className="w-20"
                  />
                  <Select
                    value={formData.weightUnit}
                    onChange={(e) => setFormData(prev => ({ ...prev, weightUnit: e.target.value as 'kg' | 'lbs' }))}
                    className="w-20"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </Select>
                </div>
              </div>
            </div>

            {/* Vacunas */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Syringe className="h-5 w-5" />
                  Vacunas
                </h3>
                <Button type="button" onClick={addVaccination} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Vacuna
                </Button>
              </div>

              {vaccinations.map((vaccination, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Vacuna #{index + 1}</span>
                    <Button
                      type="button"
                      onClick={() => removeVaccination(index)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de vacuna
                      </label>
                      <Select
                        value={vaccination.name}
                        onChange={(e) => updateVaccination(index, 'name', e.target.value)}
                      >
                        <option value="">Seleccionar vacuna</option>
                        {VACCINATION_OPTIONS.map(vaccine => (
                          <option key={vaccine} value={vaccine}>{vaccine}</option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha
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
                  </div>
                </div>
              ))}

              {vaccinations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Syringe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay vacunas registradas</p>
                  <p className="text-sm">Haz clic en "Agregar Vacuna" para comenzar</p>
                </div>
              )}
            </div>

            {/* Tratamientos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Tratamientos y Medicamentos
                </h3>
                <Button type="button" onClick={addTreatment} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Tratamiento
                </Button>
              </div>

              {treatments.map((treatment, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Tratamiento #{index + 1}</span>
                    <Button
                      type="button"
                      onClick={() => removeTreatment(index)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo
                      </label>
                      <Select
                        value={treatment.type}
                        onChange={(e) => updateTreatment(index, 'type', e.target.value)}
                      >
                        <option value="">Seleccionar</option>
                        <option value="inyeccion">Inyección</option>
                        <option value="tratamiento">Tratamiento</option>
                        <option value="antiparasitario">Antiparasitario</option>
                        <option value="medicamento">Medicamento</option>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                      </label>
                      <Input
                        value={treatment.name}
                        onChange={(e) => updateTreatment(index, 'name', e.target.value)}
                        placeholder="Nombre del tratamiento"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha
                      </label>
                      <Input
                        type="date"
                        value={treatment.date}
                        onChange={(e) => updateTreatment(index, 'date', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dosis
                      </label>
                      <Input
                        value={treatment.dose}
                        onChange={(e) => updateTreatment(index, 'dose', e.target.value)}
                        placeholder="ej: 5ml, 1 pastilla"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Notas y Observaciones */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Notas y Observaciones</h3>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Notas generales
                  </label>
                  <Tooltip content={NOTES_HELP_CONTENT}>
                    <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                  </Tooltip>
                </div>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Comportamiento, preferencias, características especiales..."
                  rows={3}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Observaciones médicas
                  </label>
                  <Tooltip content={OBSERVATIONS_HELP_CONTENT}>
                    <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                  </Tooltip>
                </div>
                <Textarea
                  value={formData.observations}
                  onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                  placeholder="Síntomas, problemas de salud, alergias..."
                  rows={3}
                />
              </div>
            </div>

            {/* Documentos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documentos y Estudios
                </h3>
                <Button type="button" onClick={addDocument} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Documento
                </Button>
              </div>

              {documents.map((document, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Documento #{index + 1}</span>
                    <Button
                      type="button"
                      onClick={() => removeDocument(index)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del documento
                      </label>
                      <Input
                        value={document.name}
                        onChange={(e) => updateDocument(index, 'name', e.target.value)}
                        placeholder="ej: Radiografía de cadera"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo
                      </label>
                      <Select
                        value={document.type}
                        onChange={(e) => updateDocument(index, 'type', e.target.value)}
                      >
                        <option value="">Seleccionar tipo</option>
                        <option value="radiografia">Radiografía</option>
                        <option value="ecografia">Ecografía</option>
                        <option value="analisis">Análisis</option>
                        <option value="certificado">Certificado</option>
                        <option value="otros">Otros</option>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Archivo
                      </label>
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) updateDocument(index, 'file', file)
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                    </div>
                  </div>

                  {document.file && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4" />
                      <span>{document.file.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {(document.file.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-3 pt-6 border-t">
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
                    Registrando...
                  </>
                ) : (
                  'Registrar Mascota'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
