export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Pet {
  id: string
  name: string
  breed: string
  birthDate: string
  age: string // Calculado automáticamente
  weight: {
    min: number
    max: number
    unit: 'kg' | 'lbs'
  }
  gender: 'macho' | 'hembra'
  photo?: string
  notes: string
  observations: string
  ownerId: string
  vaccinations: Vaccination[]
  treatments: Treatment[]
  appointments: Appointment[]
  documents: PetDocument[]
  consultationRecords: ConsultationRecord[]
}

export interface Vaccination {
  id: string
  petId: string
  name: VaccinationType
  date: string
  nextDue?: string
  veterinarian: string
  notes?: string
}

export interface Treatment {
  id: string
  petId: string
  type: 'inyeccion' | 'tratamiento' | 'antiparasitario' | 'medicamento'
  name: string
  date: string
  dose?: string
  frequency?: string
  duration?: string
  veterinarian?: string
  notes?: string
}

export interface PetDocument {
  id: string
  petId: string
  name: string
  type: 'radiografia' | 'ecografia' | 'analisis' | 'certificado' | 'otros'
  uploadDate: string
  fileUrl?: string
  fileSize?: number
  veterinarian?: string
  notes?: string
}

export interface ConsultationRecord {
  id: string
  petId: string
  type: 'vacunacion' | 'tratamiento' | 'consulta' | 'control' | 'emergencia' | 'cirugia' | 'estetica' | 'revision'
  title: string
  date: string
  veterinarian?: string
  clinicName?: string
  findings?: string
  diagnosis: string
  prescription?: string
  nextSteps?: string
  notes?: string
  cost?: number
  nextAppointment?: string
  photos?: string[]
  documents?: string[]
  createdBy: 'owner' | 'vet'
  createdAt: string
}

export type VaccinationType = 
  | 'Rabia'
  | 'DHPP (Múltiple)'
  | 'Parvovirus'
  | 'Moquillo'
  | 'Hepatitis'
  | 'Parainfluenza'
  | 'Bordetella'
  | 'Leptospirosis'
  | 'Lyme'
  | 'Triple Felina (FVRCP)'
  | 'Leucemia Felina (FeLV)'
  | 'Panleucopenia'
  | 'Rinotraqueitis'
  | 'Calicivirus'
  | 'Otra'

export interface Appointment {
  id: string
  petId: string
  type: 'consulta' | 'vacuna' | 'emergencia' | 'control'
  date: string
  veterinarian: string
  notes?: string
  status: 'programada' | 'completada' | 'cancelada'
}

export interface Reminder {
  id: string
  petId: string
  type: ReminderType
  title: string
  description: string
  date: string
  time?: string
  location?: string
  isCompleted: boolean
}

export type ReminderType = 
  | 'vacuna'
  | 'tratamiento' 
  | 'control'
  | 'operacion'
  | 'higiene'
  | 'desparasitacion'
  | 'revision'
  | 'estetica'
  | 'emergencia'
  | 'medicacion'

export interface FAQ {
  id: string
  question: string
  answer: string
  category: 'alimentacion' | 'salud' | 'comportamiento' | 'cuidados' | 'emergencias'
  species: ('perro' | 'gato' | 'general')[]
}

