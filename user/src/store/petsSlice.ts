import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Pet, ConsultationRecord } from '../types/index.js'

interface PetsState {
  pets: Pet[]
  selectedPet: Pet | null
  isLoading: boolean
}

const initialState: PetsState = {
  pets: [],
  selectedPet: null,
  isLoading: false,
}

const petsSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {
    setPets: (state, action: PayloadAction<Pet[]>) => {
      state.pets = action.payload
    },
    setSelectedPet: (state, action: PayloadAction<Pet | null>) => {
      state.selectedPet = action.payload
    },
    addPet: (state, action: PayloadAction<Pet>) => {
      const newPet = {
        ...action.payload,
        id: Date.now().toString(),
        vaccinations: action.payload.vaccinations.map(v => ({ ...v, petId: Date.now().toString() })),
        treatments: action.payload.treatments.map(t => ({ ...t, petId: Date.now().toString() })),
        documents: action.payload.documents.map(d => ({ ...d, petId: Date.now().toString() })),
        consultationRecords: action.payload.consultationRecords?.map(c => ({ ...c, petId: Date.now().toString() })) || []
      }
      state.pets.push(newPet)
    },
    addConsultationRecord: (state, action: PayloadAction<ConsultationRecord>) => {
      const pet = state.pets.find(p => p.id === action.payload.petId)
      if (pet) {
        pet.consultationRecords.push(action.payload)
      }
    },
    updatePet: (state, action: PayloadAction<Pet>) => {
      const index = state.pets.findIndex(pet => pet.id === action.payload.id)
      if (index !== -1) {
        state.pets[index] = action.payload
      }
    },
    deletePet: (state, action: PayloadAction<string>) => {
      state.pets = state.pets.filter(pet => pet.id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { setPets, setSelectedPet, addPet, addConsultationRecord, updatePet, deletePet, setLoading } = petsSlice.actions
export default petsSlice.reducer
