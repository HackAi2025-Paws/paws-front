import type { Patient, PatientRecord, PatientDetails, PatientsClient } from '../modules/patients/types'
import { mockPatientsClient } from '../modules/patients/mockClient'
import { MOCK_PATIENT_DETAILS } from '../modules/patients/mockData'
import { useMockData } from '../config/app'

export interface PatientService {
  getPatient(id: string): Promise<Patient | null>
  getPatientRecords(patientId: string): Promise<PatientRecord[]>
  getPatientDetails(patientId: string): Promise<PatientDetails | undefined>
  searchRecords(records: PatientRecord[], query: string, filter?: 'all' | 'owner' | 'pet' | 'breed', patient?: Patient | null, patientDetails?: PatientDetails): PatientRecord[]
  exportPatientData(patientId: string, options: string[]): Promise<void>
}

export class MockPatientService implements PatientService {
  constructor(private client: PatientsClient = mockPatientsClient) {}

  async getPatient(id: string): Promise<Patient | null> {
    return this.client.getById(id)
  }

  async getPatientRecords(patientId: string): Promise<PatientRecord[]> {
    return this.client.listRecords(patientId)
  }

  async getPatientDetails(patientId: string): Promise<PatientDetails | undefined> {
    // TODO: Replace with actual API call when implementing real data
    return MOCK_PATIENT_DETAILS[patientId]
  }

  searchRecords(
    records: PatientRecord[],
    query: string,
    filter: 'all' | 'owner' | 'pet' | 'breed' = 'all',
    patient?: Patient | null,
    patientDetails?: PatientDetails
  ): PatientRecord[] {
    if (!query.trim()) return records

    const q = query.toLowerCase().trim()
    return records.filter((record) => {
      // Default search behavior (when filter is 'all' or when no specific data available)
      if (filter === 'all' || !patient || !patientDetails) {
        const basicMatch = (
          record.title.toLowerCase().includes(q) ||
          record.doctor.toLowerCase().includes(q) ||
          record.type.toLowerCase().includes(q)
        )

        const recordDate = new Date(record.date)
        const dateMatches = [
          recordDate.toLocaleDateString('es-ES'),
          recordDate.toLocaleDateString('es-ES', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit'
          }),
          recordDate.getFullYear().toString(),
          (recordDate.getMonth() + 1).toString().padStart(2, '0'),
          recordDate.toLocaleDateString('es-ES', { month: 'long' }),
          recordDate.toLocaleDateString('es-ES', { month: 'short' }),
          recordDate.getDate().toString().padStart(2, '0')
        ].some(dateFormat => dateFormat.toLowerCase().includes(q))

        return basicMatch || dateMatches
      }

      // Filtered search behavior
      switch (filter) {
        case 'owner':
          return patient.ownerName?.toLowerCase().includes(q) || false
        case 'pet':
          return patient.name.toLowerCase().includes(q)
        case 'breed':
          return patient.breed?.toLowerCase().includes(q) || false
        default:
          return false
      }
    })
  }

  async exportPatientData(patientId: string, options: string[]): Promise<void> {
    // TODO: Replace with actual PDF export implementation
    console.log('Exportando datos del paciente:', patientId, 'Opciones:', options)
    return new Promise((resolve) => {
      setTimeout(() => {
        alert(`PDF exportado con: ${options.join(', ')}`)
        resolve()
      }, 500)
    })
  }
}

// TODO: Replace with real API service when integrating with backend
export class ApiPatientService implements PatientService {
  async getPatient(id: string): Promise<Patient | null> {
    const response = await fetch(`/api/patients/${id}`)
    return response.json()
  }

  async getPatientRecords(patientId: string): Promise<PatientRecord[]> {
    const response = await fetch(`/api/patients/${patientId}/records`)
    return response.json()
  }

  async getPatientDetails(patientId: string): Promise<PatientDetails | undefined> {
    const response = await fetch(`/api/patients/${patientId}/details`)
    return response.json()
  }

  searchRecords(
    records: PatientRecord[],
    query: string,
    filter: 'all' | 'owner' | 'pet' | 'breed' = 'all',
    patient?: Patient | null,
    patientDetails?: PatientDetails
  ): PatientRecord[] {
    // Client-side filtering (could be moved to server-side)
    return new MockPatientService().searchRecords(records, query, filter, patient, patientDetails)
  }

  async exportPatientData(patientId: string, options: string[]): Promise<void> {
    const response = await fetch('/api/patients/export-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, options })
    })

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `paciente-${patientId}-${Date.now()}.pdf`
    a.click()
  }
}

// Service factory - easy to switch between mock and real implementation
export const createPatientService = (useMock?: boolean): PatientService => {
  const shouldUseMock = useMock ?? useMockData()
  return shouldUseMock ? new MockPatientService() : new ApiPatientService()
}

// Singleton pattern for consistency across the app
let serviceInstance: PatientService | null = null

export const getPatientService = (): PatientService => {
  if (!serviceInstance) {
    serviceInstance = createPatientService()
  }
  return serviceInstance
}