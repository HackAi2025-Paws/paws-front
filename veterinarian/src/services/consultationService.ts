import { apiClient } from './apiClient'

// Enum mapping from Spanish to English
const CONSULTATION_TYPE_MAP: Record<string, string> = {
  'Consulta General': 'GENERAL_CONSULTATION',
  'Vacunación': 'VACCINATION',
  'Tratamiento': 'TREATMENT',
  'Control': 'CHECKUP',
  'Emergencia': 'EMERGENCY',
  'Cirugía': 'SURGERY',
  'Estética': 'AESTHETIC',
  'Revisión': 'REVIEW'
}

export interface ConsultationData {
  petId: number
  userId: number
  consultationType: string // Spanish type
  date: string
  chiefComplaint: string
  findings?: string
  diagnosis?: string
  nextSteps?: string
  additionalNotes?: string
  nextConsultation?: string
  vaccines?: Array<{
    catalogId: number
    applicationDate: string
    expirationDate?: string
  }>
  treatment?: Array<{
    name: string
    startDate: string
    endDate?: string
  }>
}

export function prepareConsultationData(data: ConsultationData): any {
  const transformedData: any = {
    petId: data.petId,
    userId: data.userId,
    consultationType: CONSULTATION_TYPE_MAP[data.consultationType] || 'GENERAL_CONSULTATION',
    date: data.date,
    chiefComplaint: data.chiefComplaint
  }

  // Only include optional fields if they have values
  if (data.findings?.trim()) {
    transformedData.findings = data.findings.trim()
  }

  if (data.diagnosis?.trim()) {
    transformedData.diagnosis = data.diagnosis.trim()
  }

  if (data.nextSteps?.trim()) {
    transformedData.nextSteps = data.nextSteps.trim()
  }

  if (data.additionalNotes?.trim()) {
    transformedData.additionalNotes = data.additionalNotes.trim()
  }

  if (data.nextConsultation) {
    transformedData.nextConsultation = data.nextConsultation
  }

  if (data.vaccines && data.vaccines.length > 0) {
    transformedData.vaccines = data.vaccines
  }

  if (data.treatment && data.treatment.length > 0) {
    transformedData.treatment = data.treatment
  }

  return transformedData
}

export class ConsultationService {
  async createConsultation(data: ConsultationData): Promise<any> {
    const preparedData = prepareConsultationData(data)

    console.log('Sending consultation data:', JSON.stringify(preparedData, null, 2))

    const response = await apiClient.post('consultations', preparedData)

    if (!response.success) {
      throw new Error(response.error || 'Failed to create consultation')
    }

    return response.data
  }
}

export const consultationService = new ConsultationService()
export default consultationService