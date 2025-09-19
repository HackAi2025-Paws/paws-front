import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Tooltip } from '../ui/tooltip'
import { 
  Camera, 
  Plus, 
  X, 
  HelpCircle
} from 'lucide-react'
import type { Pet } from '../../types'

interface AddPetFormProps {
  onSubmit: (pet: Omit<Pet, 'id'>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const NOTES_HELP_CONTENT = (
  <div className="text-left">
    <p className="font-medium mb-2">¿Qué incluir en las notas?</p>
    <ul className="space-y-1 text-xs">
      <li>• Comportamiento habitual</li>
      <li>• Preferencias alimentarias</li>
      <li>• Características especiales</li>
      <li>• Cuidados específicos</li>
      <li>• Datos de contacto adicionales</li>
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
        alert('El archivo es muy grande. Por favor selecciona una imagen menor a 5MB')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.species || !formData.birthDate) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    const pet: Omit<Pet, 'id'> = {
      name: formData.name,
      breed: formData.breed || 'Desconocida',
      species: formData.species,
      birthDate: formData.birthDate,
      age: formData.birthDate ? `${new Date().getFullYear() - new Date(formData.birthDate).getFullYear()} años` : '0 años',
      weight: formData.weightMin && formData.weightMax ? {
        min: parseFloat(formData.weightMin),
        max: parseFloat(formData.weightMax),
        unit: formData.weightUnit
      } : {
        min: 0,
        max: 0,
        unit: 'kg' as const
      },
      gender: formData.gender || 'no especificado',
      photo: formData.photo ? URL.createObjectURL(formData.photo) : undefined,
      notes: formData.notes,
      observations: formData.observations,
      ownerId: '1', // TODO: Get from auth state
      vaccinations: [],
      treatments: [],
      appointments: [],
      documents: [],
      consultationRecords: []
    }

    await onSubmit(pet)
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
            {/* Información básica */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="ej: Max, Luna"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Raza
                  </label>
                  <Input
                    value={formData.breed}
                    onChange={(e) => setFormData(prev => ({ ...prev, breed: e.target.value }))}
                    placeholder="ej: Golden Retriever, Persa"
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
                    <option value="">Seleccionar</option>
                    <option value="perro">Perro</option>
                    <option value="gato">Gato</option>
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

              {/* Foto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto de la mascota
                </label>
                <div className="space-y-3">
                  {formData.photo ? (
                    <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={URL.createObjectURL(formData.photo)}
                        alt="Vista previa"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        onClick={removePhoto}
                        size="sm"
                        variant="ghost"
                        className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <Camera className="h-8 w-8 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">Subir foto</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  )}
                </div>
              </div>
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