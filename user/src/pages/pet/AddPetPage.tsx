import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../../components/layout/Header'
import { AddPetForm } from '../../components/forms/AddPetForm'
import { useAppDispatch } from '../../hooks'
import { loadPets } from '../../store/petsSlice'
import { petService } from '../../services/petService'
import type { Pet } from '../../types/index.js'

export const AddPetPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (petData: Omit<Pet, 'id'>) => {
    setIsLoading(true)
    try {
      console.log('🐕 Creating pet via backend API...')
      
      // Crear mascota usando el servicio real (POST /pets)
      const createdPet = await petService.createPet(petData)
      
      console.log('✅ Pet created successfully:', createdPet)
      
      // Recargar la lista de mascotas para incluir la nueva
      dispatch(loadPets())
      
      navigate('/dashboard')
    } catch (error) {
      console.error('❌ Error creating pet:', error)
      alert('Error al crear la mascota. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Agregar Mascota" showBack />
      <AddPetForm onSubmit={handleSubmit} onCancel={handleCancel} isLoading={isLoading} />
    </div>
  )
}
