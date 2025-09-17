import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../../components/layout/Header'
import { AddPetForm } from '../../components/forms/AddPetForm'
import { useAppDispatch } from '../../hooks'
import { addPet } from '../../store/petsSlice'
import type { Pet } from '../../types/index.js'

export const AddPetPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleSubmit = (petData: Omit<Pet, 'id'>) => {
    dispatch(addPet(petData as Pet))
    navigate('/dashboard')
  }

  const handleCancel = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Agregar Mascota" showBack />
      <AddPetForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  )
}
