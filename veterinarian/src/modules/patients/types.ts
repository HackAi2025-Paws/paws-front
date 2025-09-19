export type Patient = {
  id: string
  name: string
  species: string
  breed?: string
  ownerName: string
  avatarUrl?: string
  summary: string
  age: string
  lastVisitAgo: string;
  status: string;
}

export type PatientSearchInput = {
  query: string
}

export interface PatientsClient {
  search(input: PatientSearchInput): Promise<Patient[]>
  listRecent(): Promise<Patient[]>
  getById(id: string): Promise<Patient | null>
  listRecords(patientId: string): Promise<PatientRecord[]>
}

export type PatientRecord = {
  id: string
  patientId: string
  date: string
  title: string
  doctor: string
  type: 'Consulta' | 'Vacunación' | 'Tratamiento'
  description?: string
  temperature?: string
  weight?: string
  heartRate?: string
  medication?: string
  nextAppointment?: string
  anesthesia?: string
  duration?: string
  attachments?: { id: string; name: string; url: string }[]
}

export type PatientDetails = {
  weight: string
  sex: string
  birthDate: string
  ownerPhone: string
  ownerEmail: string
}

export type ExportOptions = {
  historia: boolean
  vacunas: boolean
  resumen: boolean
}


