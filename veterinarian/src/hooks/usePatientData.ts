import { useMemo } from 'react'
import type { PatientDetails } from '../modules/patients/types'
import { MOCK_PATIENT_DETAILS } from '../modules/patients/mockData'

export function usePatientData(patientId?: string) {
  const patientDetails = useMemo((): PatientDetails | undefined => {
    if (!patientId) return undefined
    return MOCK_PATIENT_DETAILS[patientId]
  }, [patientId])

  // TODO: Replace with actual API call when implementing real data integration
  // const { data: patientDetails, loading } = useQuery(['patient-details', patientId], () =>
  //   patientApi.getDetails(patientId)
  // )

  return {
    patientDetails,
    // loading: false // TODO: Add loading state for real implementation
  }
}