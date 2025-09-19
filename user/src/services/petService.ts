import apiClient from './apiClient'
import { env } from '../config/env'
import { mockPets } from '../data/mockData'
import type { Pet, Reminder, ConsultationRecord, ReminderType, VaccinationType } from '../types'

// Tipos para el backend
interface BackendPet {
  id: number
  name: string
  breed?: string
  dateOfBirth?: string
  species?: string
  sex?: string
  weight?: number
  owners?: Array<{ id: number; name: string; phone: string }>
  vaccines?: BackendVaccine[]
  treatments?: BackendTreatment[]
  consultations?: BackendConsultation[]
}

interface BackendVaccine {
  id: number
  catalogId?: number
  applicationDate?: string
  expirationDate?: string
  batchNumber?: string
  notes?: string
  catalog?: { name: string; description?: string }
  pet?: { id: number; name: string }
  author?: { id: number; name: string }
  consultation?: BackendConsultation
}

interface BackendTreatment {
  id: number
  name: string
  startDate?: string
  endDate?: string
  notes?: string
  petId?: number
}

interface BackendConsultation {
  id: number
  petId: number
  userId?: number
  consultationType: string
  date: string
  chiefComplaint?: string
  findings?: string
  diagnosis?: string
  nextSteps?: string
  additionalNotes?: string
  nextConsultation?: string
  createdAt?: string
  cost?: number
  veterinarian?: string
  clinicName?: string
  user?: { id: number; name: string; phone?: string }
  pet?: { id: number; name: string; dateOfBirth?: string; species?: string; owners?: Array<{ id: number; name: string; phone: string }> }
  treatment?: BackendTreatment[]
  vaccines?: BackendVaccine[]
}

interface BackendPending {
  id: number
  title: string
  description?: string
  category: string
  date?: string
  location?: string
  status: string
  petId: number
  userId?: number
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Interfaces para parámetros de formularios
interface VaccinationFormData {
  type?: string
  date?: string
  expirationDate?: string
  batchNumber?: string
  veterinarian?: string
  notes?: string
}

interface TreatmentFormData {
  name: string
  type?: string
  startDate?: string
  endDate?: string
  dosage?: string
  instructions?: string
  veterinarian?: string
}

// Mapeo de tipos de recordatorio frontend a categorías backend
const reminderTypeToCategory = (type: ReminderType): string => {
  const mapping: Record<ReminderType, string> = {
    'vacuna': 'VACCINATION',
    'tratamiento': 'TREATMENT',
    'control': 'VET_CONTROL',
    'operacion': 'SURGERY',
    'higiene': 'HYGINE', // Nota: mantener el typo del backend
    'desparasitacion': 'TREATMENT',
    'revision': 'GENERAL_REVISION',
    'estetica': 'AESTHETICS',
    'emergencia': 'VET_CONTROL',
    'medicacion': 'TREATMENT'
  }
  return mapping[type] || 'GENERAL_REVISION'
}

// Mapeo de tipos de consulta frontend a backend
const consultationTypeToBackend = (type: ConsultationRecord['type']): string => {
  const mapping: Record<ConsultationRecord['type'], string> = {
    'consulta': 'GENERAL_CONSULTATION',
    'vacunacion': 'VACCINATION',
    'tratamiento': 'TREATMENT', 
    'control': 'CHECKUP',
    'emergencia': 'EMERGENCY',
    'cirugia': 'SURGERY',
    'estetica': 'AESTHETIC',
    'revision': 'REVIEW'
  }
  return mapping[type] || 'GENERAL_CONSULTATION'
}

// Mapeo inverso de tipos de consulta backend a frontend
const consultationTypeToFrontend = (backendType: string): ConsultationRecord['type'] => {
  const mapping: Record<string, ConsultationRecord['type']> = {
    'GENERAL_CONSULTATION': 'consulta',
    'VACCINATION': 'vacunacion',
    'TREATMENT': 'tratamiento',
    'CHECKUP': 'control',
    'EMERGENCY': 'emergencia',
    'SURGERY': 'cirugia',
    'AESTHETIC': 'estetica',
    'REVIEW': 'revision'
  }
  return mapping[backendType] || 'consulta'
}

// Helper para formatear fechas del backend manteniendo la fecha local
const formatBackendDate = (dateString: string): string => {
  if (!dateString) return ''
  
  // El backend devuelve fechas UTC, necesitamos mantener solo la fecha
  const date = new Date(dateString)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

// Helper para mapear nombres de vacunas del backend a VaccinationType
const mapVaccineNameToType = (backendName: string): VaccinationType => {
  const normalizedName = backendName.toLowerCase().trim()
  
  // Mapeo de nombres comunes del backend a tipos frontend
  const mapping: Record<string, VaccinationType> = {
    'rabia': 'Rabia',
    'dhpp': 'DHPP (Múltiple)',
    'múltiple': 'DHPP (Múltiple)',
    'parvovirus': 'Parvovirus',
    'moquillo': 'Moquillo',
    'hepatitis': 'Hepatitis',
    'parainfluenza': 'Parainfluenza',
    'bordetella': 'Bordetella',
    'leptospirosis': 'Leptospirosis',
    'lyme': 'Lyme',
    'fvrcp': 'Triple Felina (FVRCP)',
    'triple felina': 'Triple Felina (FVRCP)',
    'coronavirus': 'Coronavirus',
    'giardia': 'Giardia',
    'leishmaniosis': 'Leishmaniosis',
    'pentavalente': 'Pentavalente',
    'quintuple': 'Pentavalente',
    'quíntuple': 'Pentavalente',
    'sextuple': 'Sextuple',
    'séxtuple': 'Sextuple',
    'leucemia felina': 'Leucemia Felina (FeLV)',
    'felv': 'Leucemia Felina (FeLV)',
    'panleucopenia': 'Panleucopenia',
    'rinotraqueitis': 'Rinotraqueitis',
    'calicivirus': 'Calicivirus'
  }
  
  // Buscar coincidencia exacta o parcial
  for (const [key, value] of Object.entries(mapping)) {
    if (normalizedName.includes(key)) {
      return value
    }
  }
  
  // Si no se encuentra coincidencia, retornar 'Otra'
  return 'Otra'
}

export interface PetService {
  getAllPets(): Promise<Pet[]>
  getPetById(id: string): Promise<Pet>
  createPet(pet: Omit<Pet, 'id'>): Promise<Pet>
  updatePet(id: string, pet: Partial<Pet>): Promise<Pet>
  deletePet(id: string): Promise<void>
  getPetReminders(petId: string): Promise<Reminder[]>
  createReminder(reminder: Omit<Reminder, 'id'>): Promise<Reminder>
  updateReminder(id: string, reminder: Partial<Reminder>): Promise<Reminder>
  deleteReminder(id: string): Promise<void>
  createConsultation(consultation: Omit<ConsultationRecord, 'id' | 'createdAt'>): Promise<ConsultationRecord>
  createConsultationWithVaccinesAndTreatments(consultation: Omit<ConsultationRecord, 'id' | 'createdAt'>, vaccinations?: VaccinationFormData[], treatments?: TreatmentFormData[]): Promise<ConsultationRecord>
  getConsultations(petId?: string): Promise<ConsultationRecord[]>
  // Deprecated methods - keeping for compatibility
  addConsultationRecord(record: Omit<ConsultationRecord, 'id' | 'createdAt'>): Promise<ConsultationRecord>
  getPetConsultations(petId: string): Promise<ConsultationRecord[]>
}

class PetServiceImpl implements PetService {
  // Mapeo inverso de categorías backend a tipos de recordatorio frontend
  private categoryToReminderType(category: string): ReminderType {
    const mapping: Record<string, ReminderType> = {
      'VACCINATION': 'vacuna',
      'TREATMENT': 'tratamiento',
      'VET_CONTROL': 'control',
      'SURGERY': 'operacion',
      'HYGINE': 'higiene',
      'GENERAL_REVISION': 'revision',
      'AESTHETICS': 'estetica'
    }
    return mapping[category] || 'revision'
  }

  // Método auxiliar para calcular edad
  private calculateAge(dateOfBirth: string): string {
    if (!dateOfBirth) return 'Edad desconocida'
    
    const today = new Date()
    const birth = new Date(dateOfBirth)
    const ageInMs = today.getTime() - birth.getTime()
    const ageInYears = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365))
    const ageInMonths = Math.floor((ageInMs % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))

    if (ageInYears > 0) {
      return `${ageInYears} año${ageInYears > 1 ? 's' : ''}`
    } else if (ageInMonths > 0) {
      return `${ageInMonths} mes${ageInMonths > 1 ? 'es' : ''}`
    } else {
      return 'Menos de un mes'
    }
  }
  async getAllPets(): Promise<Pet[]> {
    if (env.MOCK_API) {
      return Promise.resolve(mockPets)
    }
    
    try {
      console.log('📥 Fetching all pets from backend...')
      
      const response = await apiClient.get('/pets')
      
      if (!response.success) {
        throw new Error(response.error || 'Error fetching pets')
      }

      // El backend devuelve { data: [...], pagination: {...} }
      const apiResponse = response as ApiResponse<{ data: BackendPet[] } | BackendPet[]>
      const petsData = Array.isArray(apiResponse.data) ? apiResponse.data : (apiResponse.data as { data: BackendPet[] })?.data || []
      
      console.log('📋 Pets from backend:', petsData)
      
      // Mapear datos del backend al formato frontend
      const mappedPets: Pet[] = Array.isArray(petsData) ? petsData.map((pet: BackendPet) => ({
        id: pet.id.toString(),
        name: pet.name,
        breed: pet.breed || 'Raza no especificada',
        birthDate: pet.dateOfBirth ? new Date(pet.dateOfBirth).toISOString().split('T')[0] : '',
        age: this.calculateAge(pet.dateOfBirth || ''),
        species: pet.species ? (pet.species.toLowerCase() === 'dog' ? 'perro' : 'gato') : 'perro',
        weight: pet.weight ? { min: pet.weight, max: pet.weight, unit: 'kg' } : { min: 0, max: 0, unit: 'kg' },
        color: '',
        gender: pet.sex ? (pet.sex.toLowerCase() === 'male' ? 'macho' : 'hembra') : 'no especificado',
        microchipId: '',
        ownerPhone: pet.owners?.[0]?.phone || '',
        medicalConditions: [],
        allergies: [],
        vaccinations: [],
        treatments: [],
        appointments: [],
        consultationRecords: [],
        documents: [],
        notes: '',
        observations: ''
      })) : []

      console.log('📋 Mapped pets:', mappedPets)
      return mappedPets
    } catch (error) {
      console.error('❌ Error fetching pets:', error)
      // En lugar de fallback a mock, devolver array vacío
      return []
    }
  }

  async getPetById(id: string): Promise<Pet> {
    if (env.MOCK_API) {
      const pet = mockPets.find(p => p.id === id)
      if (!pet) throw new Error('Pet not found')
      return Promise.resolve(pet)
    }
    
    try {
      console.log('📥 Fetching pet by ID:', id)
      
      const response = await apiClient.get('/pets', { id: parseInt(id) })
      
      if (!response.success) {
        throw new Error(response.error || 'Pet not found')
      }

      const petData = (response as ApiResponse<BackendPet>).data!
      console.log('📋 Pet details from backend:', petData)
      
      // Mapear respuesta detallada del backend al formato frontend
      const mappedPet: Pet = {
        id: petData.id.toString(),
        name: petData.name,
        breed: petData.breed || 'Raza no especificada',
        birthDate: petData.dateOfBirth ? new Date(petData.dateOfBirth).toISOString().split('T')[0] : '',
        age: this.calculateAge(petData.dateOfBirth || ''),
        species: petData.species ? (petData.species.toLowerCase() === 'dog' ? 'perro' : 'gato') : 'perro',
        weight: petData.weight ? { min: petData.weight, max: petData.weight, unit: 'kg' } : { min: 0, max: 0, unit: 'kg' },
        color: '',
        gender: petData.sex ? (petData.sex.toLowerCase() === 'male' ? 'macho' : 'hembra') : 'no especificado',
        microchipId: '',
        ownerPhone: petData.owners?.[0]?.phone || '',
        medicalConditions: [],
        allergies: [],
        // Mapear vaccinations si vienen del backend
        vaccinations: petData.vaccines ? petData.vaccines.map((vaccine: BackendVaccine) => ({
          id: vaccine.id.toString(),
          petId: petData.id.toString(),
          name: mapVaccineNameToType(vaccine.catalog?.name || 'Otra'),
          date: vaccine.applicationDate ? new Date(vaccine.applicationDate).toISOString().split('T')[0] : '',
          nextDue: vaccine.expirationDate ? new Date(vaccine.expirationDate).toISOString().split('T')[0] : '',
          veterinarian: 'Veterinario',
          notes: vaccine.notes || ''
        })) : [],
        // Mapear treatments si vienen del backend
        treatments: petData.treatments ? petData.treatments.map((treatment: BackendTreatment) => ({
          id: treatment.id.toString(),
          petId: petData.id.toString(),
          type: 'tratamiento',
          name: treatment.name,
          date: treatment.startDate ? new Date(treatment.startDate).toISOString().split('T')[0] : '',
          dose: '',
          veterinarian: 'Veterinario'
        })) : [],
        // Mapear consultations si vienen del backend
        consultationRecords: petData.consultations ? petData.consultations.map((consultation: BackendConsultation) => ({
          id: consultation.id.toString(),
          petId: petData.id.toString(),
          type: consultationTypeToFrontend(consultation.consultationType), // Mapear tipo correcto
          title: consultation.chiefComplaint || 'Consulta',
          date: formatBackendDate(consultation.date),
          veterinarian: consultation.user?.name || 'Veterinario',
          clinicName: '',
          findings: consultation.findings,
          diagnosis: consultation.diagnosis || '',
          prescription: undefined, // Campo requerido pero no disponible en backend
          nextSteps: consultation.nextSteps,
          notes: consultation.additionalNotes,
          cost: consultation.cost,
          nextAppointment: consultation.nextConsultation ? formatBackendDate(consultation.nextConsultation) : undefined,
          createdBy: 'owner' as const,
          createdAt: consultation.createdAt || new Date().toISOString()
        })) : [],
        appointments: [],
        documents: [],
        notes: '',
        observations: ''
      }

      console.log('📋 Mapped pet with details:', mappedPet)
      return mappedPet
    } catch (error) {
      console.error('❌ Error fetching pet by ID:', error)
      throw new Error('Pet not found')
    }
  }

  async createPet(petData: Omit<Pet, 'id'>): Promise<Pet> {
    if (env.MOCK_API) {
      const newPet: Pet = {
        ...petData,
        id: Date.now().toString(),
      }
      return Promise.resolve(newPet)
    }
    
    try {
      console.log('🔄 Creating pet with nested vaccines and treatments...')
      
      // Mapear datos del frontend al formato del backend
      const backendData = {
        name: petData.name,
        dateOfBirth: petData.birthDate, // Mapear birthDate -> dateOfBirth
        species: petData.species ? (petData.species === 'perro' ? 'DOG' : 'CAT') : 'DOG', // DOG/CAT
        sex: petData.gender ? (petData.gender === 'macho' ? 'MALE' : 'FEMALE') : 'MALE', // Mapear gender -> sex
        weight: petData.weight?.min || 1, // Usar peso mínimo como referencia
        breed: petData.breed,
        
        // Vacunas anidadas
        vaccines: petData.vaccinations && petData.vaccinations.length > 0 ? petData.vaccinations.map(vaccination => ({
          catalogId: 1, // Por ahora hardcodeado
          applicationDate: vaccination.date ? new Date(vaccination.date).toISOString() : new Date().toISOString(),
          expirationDate: vaccination.expirationDate ? new Date(vaccination.expirationDate).toISOString() : undefined,
          batchNumber: vaccination.batchNumber || undefined,
          notes: `${vaccination.name} - ${vaccination.veterinarian || 'Veterinario no especificado'} - ${vaccination.notes || ''}`,
        })) : undefined,
        
        // Tratamientos anidados
        treatments: petData.treatments && petData.treatments.length > 0 ? petData.treatments.map(treatment => ({
          name: treatment.name || treatment.medication,
          startDate: treatment.startDate || treatment.date ? new Date(treatment.startDate || treatment.date).toISOString() : new Date().toISOString(),
          endDate: treatment.endDate ? new Date(treatment.endDate).toISOString() : undefined,
          notes: `${treatment.type || ''} - ${treatment.dosage || treatment.dose || ''} - ${treatment.instructions || ''} - ${treatment.veterinarian || 'Veterinario no especificado'}`,
        })) : undefined
      }

      console.log('📤 Creating pet with data:', backendData)
      console.log('📋 Original pet data:', petData)
      console.log('💉 Vaccinations to include:', backendData.vaccines)
      console.log('💊 Treatments to include:', backendData.treatments)
      
      const response = await apiClient.post('/pets', backendData)
      
      if (!response.success) {
        throw new Error(response.error || 'Error creating pet')
      }

      const createdPet = (response as ApiResponse<BackendPet>).data!

      if (env.DEBUG_MODE) {
        console.log('✅ Pet with nested data created successfully:', createdPet)
      }

      // Mapear respuesta del backend al formato frontend
      const frontendPet: Pet = {
        id: createdPet.id.toString(),
        name: createdPet.name,
        breed: createdPet.breed || 'Raza no especificada',
        species: petData.species,
        birthDate: petData.birthDate,
        age: petData.age || this.calculateAge(petData.birthDate),
        weight: petData.weight || { min: 0, max: 0, unit: 'kg' },
        color: petData.color,
        gender: petData.gender || 'no especificado',
        microchipId: petData.microchipId,
        ownerPhone: petData.ownerPhone,
        medicalConditions: petData.medicalConditions,
        allergies: petData.allergies,
        vaccinations: petData.vaccinations || [],
        treatments: petData.treatments || [],
        consultationRecords: petData.consultationRecords || [],
        appointments: [],
        documents: petData.documents || [],
        notes: '',
        observations: ''
      }

      console.log('✅ Complete pet creation successful:', frontendPet)
      return frontendPet
    } catch (error) {
      console.error('❌ Error creating pet:', error)
      throw error
    }
  }

  async updatePet(id: string, petData: Partial<Pet>): Promise<Pet> {
    if (env.MOCK_API) {
      const pet = mockPets.find(p => p.id === id)
      if (!pet) throw new Error('Pet not found')
      const updatedPet = { ...pet, ...petData }
      return Promise.resolve(updatedPet)
    }
    
    try {
      const response = await apiClient.put<Pet>(`/pets/${id}`, petData)
      return (response as ApiResponse<Pet>).data || (response as unknown as Pet)
    } catch (error) {
      console.error('❌ Error updating pet:', error)
      // Fallback to mock update
      const pet = mockPets.find(p => p.id === id)
      if (!pet) throw new Error('Pet not found')
      return { ...pet, ...petData }
    }
  }

  async deletePet(id: string): Promise<void> {
    if (env.MOCK_API) {
      return Promise.resolve()
    }
    
    try {
      await apiClient.delete(`/pets/${id}`)
    } catch (error) {
      console.error('❌ Error deleting pet:', error)
      // En mock mode, simplemente resolvemos
    }
  }

  async getPetReminders(): Promise<Reminder[]> {
    if (env.MOCK_API) {
      return Promise.resolve([]) // No más datos mock
    }
    
    try {
      // Probar sin filtro de petId primero para ver todos los pendings del usuario
      console.log('📥 Fetching ALL reminders for user (no petId filter)')
      
      // Debug del token
      const storedToken = localStorage.getItem(env.AUTH_TOKEN_KEY)
      console.log('🔑 Token for GET request:', {
        tokenExists: !!storedToken,
        tokenLength: storedToken?.length || 0,
        tokenPreview: storedToken ? `${storedToken.substring(0, 30)}...` : 'No token found'
      })
      
      // Hacer GET sin filtro de petId para ver todos los pendings del usuario
      const response = await apiClient.get('/pendings')
      
      console.log('📥 GET ALL reminders response:', response)
      
      if (!response.success) {
        console.error('❌ Error fetching reminders:', response)
        throw new Error(response.error || 'Error fetching reminders')
      }

      // Convertir pendings del backend al formato de reminders del frontend
      const apiResponse = response as ApiResponse<BackendPending[]>
      const pendings = Array.isArray(apiResponse.data) ? apiResponse.data : []
      
      console.log('📋 ALL Pendings from backend:', pendings)
      console.log('📋 Number of pendings found:', pendings.length)
      
      // Si hay pendings, mostrar los petIds disponibles
      if (pendings.length > 0) {
        const availablePetIds = [...new Set(pendings.map((p: BackendPending) => p.petId))]
        console.log('📋 Available petIds in backend:', availablePetIds)
      }
      
      const reminders: Reminder[] = pendings.map((pending: BackendPending) => ({
        id: pending.id.toString(),
        petId: pending.petId.toString(),
        type: this.categoryToReminderType(pending.category),
        title: pending.title,
        description: pending.description || '',
        date: pending.date ? new Date(pending.date).toISOString().split('T')[0] : '',
        time: pending.date ? new Date(pending.date).toTimeString().slice(0, 5) : '',
        location: pending.location || '',
        isCompleted: pending.status === 'COMPLETED'
      }))

      console.log('📋 Mapped reminders:', reminders)

      return reminders
    } catch (error) {
      console.error('❌ Error fetching pet reminders:', error)
      return [] // Devolver array vacío en lugar de mock data
    }
  }

  async createReminder(reminderData: Omit<Reminder, 'id'>): Promise<Reminder> {
    if (env.MOCK_API) {
      const newReminder: Reminder = {
        ...reminderData,
        id: Date.now().toString(),
      }
      return Promise.resolve(newReminder)
    }
    
    try {
      // Crear la fecha y hora combinadas para el backend
      let combinedDateTime: string | undefined
      if (reminderData.date) {
        if (reminderData.time) {
          combinedDateTime = `${reminderData.date}T${reminderData.time}:00.000Z`
        } else {
          combinedDateTime = `${reminderData.date}T09:00:00.000Z` // Hora por defecto
        }
      }

      // Mapear datos del frontend al formato del backend
      const pendingData = {
        title: reminderData.title,
        description: reminderData.description || '',
        category: reminderTypeToCategory(reminderData.type),
        date: combinedDateTime,
        location: reminderData.location || '',
        petId: parseInt(reminderData.petId), // Usar petId del reminder
        reminderConfig: reminderData.time ? [{
          type: 'ABSOLUTE',
          date: combinedDateTime
        }] : undefined
      }

      if (env.DEBUG_MODE) {
        console.log('📤 Creating pending with data:', pendingData)
        
        // Debug auth token
        const storedToken = localStorage.getItem(env.AUTH_TOKEN_KEY)
        console.log('🔑 Token Debug:', {
          authKey: env.AUTH_TOKEN_KEY,
          tokenExists: !!storedToken,
          tokenLength: storedToken?.length || 0,
          tokenPreview: storedToken ? `${storedToken.substring(0, 30)}...` : 'No token found'
        })
      }

      const response = await apiClient.post('/pendings', pendingData)
      
      if (env.DEBUG_MODE) {
        console.log('📥 Backend response:', response)
      }
      
      if (!response.success) {
        console.error('❌ Backend error details:', response)
        throw new Error(response.error || 'Error creating reminder')
      }

      // Convertir la respuesta del backend al formato del frontend
      const backendPending = (response as ApiResponse<BackendPending>).data!
      return {
        id: backendPending.id.toString(),
        petId: backendPending.petId.toString(),
        type: reminderData.type,
        title: backendPending.title,
        description: backendPending.description || '',
        date: reminderData.date,
        time: reminderData.time,
        location: backendPending.location || '',
        isCompleted: backendPending.status === 'COMPLETED'
      }
    } catch (error) {
      console.error('❌ Error creating reminder:', error)
      // Re-lanzar el error en lugar de usar fallback mock
      throw error
    }
  }

  async updateReminder(id: string, reminderData: Partial<Reminder>): Promise<Reminder> {
    if (env.MOCK_API) {
      throw new Error('No mock data available for reminders')
    }
    
    try {
      // Mapear datos del frontend al formato del backend para actualización
      const updateData: Partial<BackendPending> & { id: number } = {
        id: parseInt(id)
      }

      if (reminderData.title) updateData.title = reminderData.title
      if (reminderData.description !== undefined) updateData.description = reminderData.description
      if (reminderData.location !== undefined) updateData.location = reminderData.location
      if (reminderData.type) updateData.category = reminderTypeToCategory(reminderData.type)
      if (reminderData.isCompleted !== undefined) {
        updateData.status = reminderData.isCompleted ? 'COMPLETED' : 'PENDING'
      }
      
      // Combinar fecha y hora si están presentes
      if (reminderData.date || reminderData.time) {
        const currentData = await this.getReminder(id) // Necesitamos obtener los datos actuales
        const date = reminderData.date || currentData.date
        const time = reminderData.time || currentData.time || '09:00'
        if (date) {
          updateData.date = `${date}T${time}:00.000Z`
        }
      }

      const response = await apiClient.put('/pendings', updateData)
      
      if (!response.success) {
        throw new Error(response.error || 'Error updating reminder')
      }

      // Convertir respuesta del backend al formato frontend
      const backendPending = (response as ApiResponse<BackendPending>).data!
      return {
        id: backendPending.id.toString(),
        petId: backendPending.petId.toString(),
        type: this.categoryToReminderType(backendPending.category),
        title: backendPending.title,
        description: backendPending.description || '',
        date: backendPending.date ? new Date(backendPending.date).toISOString().split('T')[0] : '',
        time: backendPending.date ? new Date(backendPending.date).toTimeString().slice(0, 5) : '',
        location: backendPending.location || '',
        isCompleted: backendPending.status === 'COMPLETED'
      }
    } catch (error) {
      console.error('❌ Error updating reminder:', error)
      throw error
    }
  }

  // Método auxiliar para obtener un recordatorio específico
  private async getReminder(id: string): Promise<Reminder> {
    // Implementación simple que busca en todos los recordatorios del usuario
    const reminders = await this.getPetReminders()
    const reminder = reminders.find(r => r.id === id)
    if (reminder) return reminder
    throw new Error('Reminder not found')
  }

  async deleteReminder(id: string): Promise<void> {
    if (env.MOCK_API) {
      return Promise.resolve()
    }
    
    try {
      const response = await apiClient.delete(`/pendings?id=${id}`)
      
      if (!response.success) {
        throw new Error(response.error || 'Error deleting reminder')
      }
    } catch (error) {
      console.error('❌ Error deleting reminder:', error)
      throw error
    }
  }

  async createConsultation(consultationData: Omit<ConsultationRecord, 'id' | 'createdAt'>): Promise<ConsultationRecord> {
    if (env.MOCK_API) {
      const newRecord: ConsultationRecord = {
        ...consultationData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      return Promise.resolve(newRecord)
    }
    
    try {
      // Mapear datos del frontend al formato del backend
      const backendData = {
        petId: parseInt(consultationData.petId), // Usar petId de la consulta
        // userId se agrega automáticamente en el backend desde el token
        consultationType: consultationTypeToBackend(consultationData.type),
        date: new Date(consultationData.date).toISOString(),
        chiefComplaint: consultationData.title, // Usar title como chief complaint
        findings: consultationData.findings || undefined,
        diagnosis: consultationData.diagnosis || undefined,
        nextSteps: consultationData.nextSteps || undefined,
        additionalNotes: consultationData.notes || undefined,
        nextConsultation: consultationData.nextAppointment ? new Date(consultationData.nextAppointment).toISOString() : undefined,
      }

      console.log('📤 Creating consultation with data:', backendData)
      console.log('📋 Original consultation data:', consultationData)
      
      // Debug del token antes del request
      const storedToken = localStorage.getItem(env.AUTH_TOKEN_KEY)
      const storedSession = localStorage.getItem(env.SESSION_STORAGE_KEY)
      console.log('🔑 JWT Debug before request:', {
        tokenExists: !!storedToken,
        tokenLength: storedToken?.length || 0,
        tokenPreview: storedToken ? `${storedToken.substring(0, 50)}...` : 'No token found',
        authKey: env.AUTH_TOKEN_KEY,
        sessionExists: !!storedSession,
        sessionPreview: storedSession ? JSON.parse(storedSession) : 'No session'
      })
      
      // Si no hay token, lanzar error específico
      if (!storedToken) {
        throw new Error('No authentication token found. Please login again.')
      }
      
      // Verificar que tenemos datos válidos
      if (!backendData.chiefComplaint) {
        throw new Error('Chief complaint is required but missing')
      }
      if (!backendData.date || isNaN(new Date(backendData.date).getTime())) {
        throw new Error('Valid date is required')
      }

      const response = await apiClient.post('/consultations', backendData)
      
      console.log('📥 Backend response:', response)
      
      if (!response.success) {
        console.error('❌ Backend error details:', response)
        throw new Error(response.error || 'Failed to create consultation')
      }

      // Convertir respuesta del backend al formato frontend
      const backendConsultation = (response as ApiResponse<BackendConsultation>).data!
      const newConsultation: ConsultationRecord = {
        id: backendConsultation.id.toString(),
        petId: backendConsultation.petId.toString(),
        type: consultationData.type,
        title: consultationData.title || 'Consulta',
        date: consultationData.date,
        veterinarian: consultationData.veterinarian || 'Veterinario',
        clinicName: consultationData.clinicName || '',
        findings: backendConsultation.findings,
        diagnosis: backendConsultation.diagnosis || '',
        prescription: consultationData.prescription,
        nextSteps: backendConsultation.nextSteps,
        notes: backendConsultation.additionalNotes,
        cost: consultationData.cost,
        nextAppointment: consultationData.nextAppointment,
        createdBy: 'owner' as const,
        createdAt: backendConsultation.createdAt || new Date().toISOString()
      }

      if (env.DEBUG_MODE) {
        console.log('✅ Consultation created successfully:', newConsultation)
      }

      return newConsultation
    } catch (error) {
      console.error('❌ Error creating consultation:', error)
      throw error
    }
  }

  async getConsultations(petId?: string): Promise<ConsultationRecord[]> {
    if (env.MOCK_API) {
      if (petId) {
      const pet = mockPets.find(p => p.id === petId)
      return Promise.resolve(pet?.consultationRecords || [])
      }
      return Promise.resolve([])
    }
    
    try {
      // Si se especifica petId, usarlo, sino obtener todas las consultas del usuario
      const queryParams = petId ? { petId: parseInt(petId) } : {}
      
      if (env.DEBUG_MODE) {
        console.log('📥 Fetching consultations with params:', queryParams)
      }
      
      const response = await apiClient.get('/consultations', queryParams)
      
      if (!response.success) {
        throw new Error(response.error || 'Error fetching consultations')
      }

      const consultations = Array.isArray(response.data) ? response.data : []
      
      if (env.DEBUG_MODE) {
        console.log('📋 Consultations from backend:', consultations)
      }

      // Mapear respuesta del backend al formato frontend
      const mappedConsultations: ConsultationRecord[] = consultations.map((consultation: BackendConsultation) => {
        const mappedType = consultationTypeToFrontend(consultation.consultationType)
        
        if (env.DEBUG_MODE) {
          console.log(`🔄 Mapping consultation type: ${consultation.consultationType} → ${mappedType}`)
        }
        
        return {
          id: consultation.id.toString(),
          petId: consultation.petId.toString(),
          type: mappedType, // Mapear tipo correcto
          title: consultation.chiefComplaint || 'Consulta',
          date: formatBackendDate(consultation.date),
          veterinarian: consultation.user?.name || consultation.veterinarian || 'Veterinario',
          clinicName: consultation.clinicName || '',
          findings: consultation.findings,
          diagnosis: consultation.diagnosis || '',
          prescription: undefined, // Campo requerido pero no disponible en backend
          nextSteps: consultation.nextSteps,
          notes: consultation.additionalNotes,
          cost: consultation.cost,
          nextAppointment: consultation.nextConsultation ? formatBackendDate(consultation.nextConsultation) : undefined,
          createdBy: 'owner' as const,
          createdAt: consultation.createdAt || new Date().toISOString()
        }
      })

      return mappedConsultations
    } catch (error) {
      console.error('❌ Error fetching consultations:', error)
      return []
    }
  }

  async createConsultationWithVaccinesAndTreatments(
    consultationData: Omit<ConsultationRecord, 'id' | 'createdAt'>, 
    vaccinations?: VaccinationFormData[], 
    treatments?: TreatmentFormData[]
  ): Promise<ConsultationRecord> {
    if (env.MOCK_API) {
      const newRecord: ConsultationRecord = {
        ...consultationData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      return Promise.resolve(newRecord)
    }
    
    try {
      console.log('🔄 Creating consultation with nested vaccines and treatments...')
      
      // Mapear datos del frontend al formato del backend, incluyendo vaccines y treatments
      const backendData = {
        petId: parseInt(consultationData.petId),
        consultationType: consultationTypeToBackend(consultationData.type),
        date: new Date(consultationData.date).toISOString(),
        chiefComplaint: consultationData.title,
        findings: consultationData.findings || undefined,
        diagnosis: consultationData.diagnosis || undefined,
        nextSteps: consultationData.nextSteps || undefined,
        additionalNotes: consultationData.notes || undefined,
        nextConsultation: consultationData.nextAppointment ? new Date(consultationData.nextAppointment).toISOString() : undefined,
        
        // Agregar vaccines y treatments como objetos anidados
        vaccines: vaccinations && vaccinations.length > 0 ? vaccinations.map(vaccination => ({
          catalogId: 1, // Hardcodeado por ahora
          applicationDate: vaccination.date ? new Date(vaccination.date).toISOString() : new Date().toISOString(),
          expirationDate: vaccination.expirationDate ? new Date(vaccination.expirationDate).toISOString() : undefined,
          batchNumber: vaccination.batchNumber || undefined,
          notes: `${vaccination.type} - ${vaccination.veterinarian || 'Veterinario no especificado'} - ${vaccination.notes || ''}`,
        })) : undefined,
        
        treatment: treatments && treatments.length > 0 ? treatments.map(treatment => ({
          name: treatment.name,
          startDate: treatment.startDate ? new Date(treatment.startDate).toISOString() : new Date().toISOString(),
          endDate: treatment.endDate ? new Date(treatment.endDate).toISOString() : undefined,
          notes: `${treatment.type} - ${treatment.dosage} - ${treatment.instructions} - ${treatment.veterinarian || 'Veterinario no especificado'}`,
        })) : undefined
      }

      console.log('📤 Creating consultation with data:', backendData)
      console.log('📋 Original consultation data:', consultationData)
      console.log('💉 Vaccinations to include:', vaccinations)
      console.log('💊 Treatments to include:', treatments)
      
      // Debug del token antes del request
      const storedToken = localStorage.getItem(env.AUTH_TOKEN_KEY)
      const storedSession = localStorage.getItem(env.SESSION_STORAGE_KEY)
      console.log('🔑 JWT Debug before request:', {
        tokenExists: !!storedToken,
        tokenLength: storedToken?.length || 0,
        tokenPreview: storedToken ? `${storedToken.substring(0, 50)}...` : 'No token found',
        authKey: env.AUTH_TOKEN_KEY,
        sessionExists: !!storedSession,
        sessionPreview: storedSession ? JSON.parse(storedSession) : 'No session'
      })
      
      // Si no hay token, lanzar error específico
      if (!storedToken) {
        throw new Error('No authentication token found. Please login again.')
      }
      
      // Verificar que tenemos datos válidos
      if (!backendData.chiefComplaint) {
        throw new Error('Chief complaint is required but missing')
      }
      if (!backendData.date || isNaN(new Date(backendData.date).getTime())) {
        throw new Error('Valid date is required')
      }

      const response = await apiClient.post('/consultations', backendData)
      
      console.log('📥 Backend response:', response)
      
      if (!response.success) {
        console.error('❌ Backend error details:', response)
        throw new Error(response.error || 'Failed to create consultation')
      }

      // Convertir respuesta del backend al formato frontend
      const backendConsultation = (response as ApiResponse<BackendConsultation>).data!
      const newConsultation: ConsultationRecord = {
        id: backendConsultation.id.toString(),
        petId: backendConsultation.petId.toString(),
        type: consultationData.type,
        title: consultationData.title || 'Consulta',
        date: consultationData.date,
        veterinarian: consultationData.veterinarian || 'Veterinario',
        clinicName: consultationData.clinicName || '',
        findings: backendConsultation.findings,
        diagnosis: backendConsultation.diagnosis || '',
        prescription: consultationData.prescription,
        nextSteps: backendConsultation.nextSteps,
        notes: backendConsultation.additionalNotes,
        cost: consultationData.cost,
        nextAppointment: consultationData.nextAppointment,
        createdBy: 'owner' as const,
        createdAt: backendConsultation.createdAt || new Date().toISOString()
      }

      console.log('✅ Consultation with nested data created successfully:', newConsultation)
      return newConsultation
    } catch (error) {
      console.error('❌ Error creating consultation with nested data:', error)
      throw error
    }
  }

  // Método legacy - redirige al nuevo método
  async addConsultationRecord(recordData: Omit<ConsultationRecord, 'id' | 'createdAt'>): Promise<ConsultationRecord> {
    return this.createConsultation(recordData)
  }

  // Método legacy - redirige al nuevo método
  async getPetConsultations(petId: string): Promise<ConsultationRecord[]> {
    return this.getConsultations(petId)
  }

  // Nuevos métodos para obtener vacunas y tratamientos
  async getPetVaccines(petId: string): Promise<BackendVaccine[]> {
    if (env.MOCK_API) {
      return Promise.resolve([])
    }
    
    try {
      console.log('📥 Fetching vaccines for petId:', petId)
      
      const response = await apiClient.get('/vaccines', { petId: parseInt(petId) })
      
      if (!response.success) {
        throw new Error(response.error || 'Error fetching vaccines')
      }

      const vaccines = Array.isArray(response.data) ? response.data : []
      
      console.log('📋 Vaccines from backend:', vaccines)
      
      return vaccines
    } catch (error) {
      console.error('❌ Error fetching pet vaccines:', error)
      return []
    }
  }

  async getPetTreatments(petId: string): Promise<BackendTreatment[]> {
    if (env.MOCK_API) {
      return Promise.resolve([])
    }
    
    try {
      console.log('📥 Fetching treatments for petId:', petId)
      
      const response = await apiClient.get('/treatment', { petId: parseInt(petId) })
      
      if (!response.success) {
        throw new Error(response.error || 'Error fetching treatments')
      }

      const treatments = Array.isArray(response.data) ? response.data : []
      
      console.log('📋 Treatments from backend:', treatments)
      
      return treatments
    } catch (error) {
      console.error('❌ Error fetching pet treatments:', error)
      return []
    }
  }
}

export const petService = new PetServiceImpl()
export default petService
