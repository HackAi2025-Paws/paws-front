import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select } from '../ui/select'
import { 
  Plus, 
} from 'lucide-react'
import type { Pet } from '../../types'

interface AddPetFormProps {
  onSubmit: (pet: Omit<Pet, 'id'>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export const AddPetForm: React.FC<AddPetFormProps> = ({ onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    species: '' as 'perro' | 'gato' | '',
    birthDate: '',
    weight: '',
    weightUnit: 'kg' as 'kg' | 'lbs',
    gender: '' as 'macho' | 'hembra' | '',
  })


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
      weight: formData.weight ? {
        min: parseFloat(formData.weight),
        max: parseFloat(formData.weight),
        unit: formData.weightUnit
      } : {
        min: 0,
        max: 0,
        unit: 'kg' as const
      },
      gender: formData.gender || 'no especificado',
      notes: '',
      observations: '',
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
                  Peso
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    placeholder="ej: 5.2"
                    className="flex-1"
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