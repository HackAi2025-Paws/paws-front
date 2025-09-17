import type { Patient, PatientRecord, PatientSearchInput, PatientsClient } from './types'
import { MOCK_PATIENTS, MOCK_PATIENT_RECORDS } from './mockData'

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export const mockPatientsClient: PatientsClient = {
  async search({ query }: PatientSearchInput): Promise<Patient[]> {
    await delay(200)
    const q = query.trim().toLowerCase()
    if (!q) return MOCK_PATIENTS.slice(0, 4)
    return MOCK_PATIENTS.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        (p.breed ?? '').toLowerCase().includes(q) ||
        p.ownerName.toLowerCase().includes(q) ||
        p.species.toLowerCase().includes(q)
      )
    })
  },

  async listRecent(): Promise<Patient[]> {
    await delay(180)
    return MOCK_PATIENTS.slice(0, 4)
  },

  async getById(id: string): Promise<Patient | null> {
    await delay(150)
    return MOCK_PATIENTS.find((p) => p.id === id) ?? null
  },

  async listRecords(patientId: string): Promise<PatientRecord[]> {
    await delay(200)
    return MOCK_PATIENT_RECORDS.filter((r) => r.patientId === patientId)
  },
}

export default mockPatientsClient


