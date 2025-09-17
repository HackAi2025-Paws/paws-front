import { useState, useEffect, useMemo } from 'react'
import type { Patient, PatientRecord, PatientDetails } from '../modules/patients/types'
import type { PatientService } from '../services/patientService'
import { getPatientService } from '../services/patientService'

export interface UsePatientDetailReturn {
  patient: Patient | null
  patientDetails: PatientDetails | undefined
  records: PatientRecord[]
  filteredRecords: PatientRecord[]
  loading: boolean
  recordsLoading: boolean
  error: string | null
}

export function usePatientDetail(
  patientId: string | undefined,
  searchQuery: string = '',
  service: PatientService = getPatientService()
): UsePatientDetailReturn {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [patientDetails, setPatientDetails] = useState<PatientDetails>()
  const [records, setRecords] = useState<PatientRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [recordsLoading, setRecordsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load patient data
  useEffect(() => {
    if (!patientId) return

    const loadPatient = async () => {
      setLoading(true)
      setError(null)

      try {
        const [patientData, detailsData] = await Promise.all([
          service.getPatient(patientId),
          service.getPatientDetails(patientId)
        ])

        setPatient(patientData)
        setPatientDetails(detailsData)
      } catch (err) {
        setError('Error loading patient data')
        console.error('Error loading patient:', err)
      } finally {
        setLoading(false)
      }
    }

    loadPatient()
  }, [patientId, service])

  // Load patient records
  useEffect(() => {
    if (!patientId) return

    const loadRecords = async () => {
      setRecordsLoading(true)

      try {
        const recordsData = await service.getPatientRecords(patientId)
        setRecords(recordsData)
      } catch (err) {
        setError('Error loading patient records')
        console.error('Error loading records:', err)
      } finally {
        setRecordsLoading(false)
      }
    }

    loadRecords()
  }, [patientId, service])

  // Filter records based on search query
  const filteredRecords = useMemo(() => {
    return service.searchRecords(records, searchQuery)
  }, [records, searchQuery, service])

  return {
    patient,
    patientDetails,
    records,
    filteredRecords,
    loading,
    recordsLoading,
    error
  }
}