import { useEffect, useState } from 'react'
import type { Patient, PatientRecord, PatientSearchInput, PatientsClient } from './types'

export function usePatientsSearch(client: PatientsClient, input: PatientSearchInput) {
  const [results, setResults] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    client
      .search(input)
      .then((data) => active && setResults(data))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [client, input.query])

  return { results, loading }
}

export function useRecentPatients(client: PatientsClient) {
  const [results, setResults] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    client
      .listRecent()
      .then((data) => active && setResults(data))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [client])

  return { results, loading }
}

export function usePatient(client: PatientsClient, id: string | undefined) {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    let active = true
    setLoading(true)
    client
      .getById(id)
      .then((data) => active && setPatient(data))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [client, id])

  return { patient, loading }
}

export function usePatientRecords(client: PatientsClient, patientId: string | undefined, search: string) {
  const [records, setRecords] = useState<PatientRecord[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!patientId) return
    let active = true
    setLoading(true)
    client
      .listRecords(patientId)
      .then((data) => active && setRecords(data))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [client, patientId])

  const filtered = records.filter((r) => {
    const q = search.trim().toLowerCase()
    if (!q) return true

    // Buscar por título, doctor y tipo
    const basicMatch = (
      r.title.toLowerCase().includes(q) ||
      r.doctor.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q)
    )

    // Buscar por fecha en diferentes formatos
    const recordDate = new Date(r.date)
    const dateMatches = [
      // Formato completo: dd/mm/yyyy
      recordDate.toLocaleDateString('es-ES'),
      // Formato corto: dd/mm/yy
      recordDate.toLocaleDateString('es-ES', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit'
      }),
      // Solo año: yyyy
      recordDate.getFullYear().toString(),
      // Solo mes: mm o nombre del mes
      (recordDate.getMonth() + 1).toString().padStart(2, '0'),
      recordDate.toLocaleDateString('es-ES', { month: 'long' }),
      recordDate.toLocaleDateString('es-ES', { month: 'short' }),
      // Solo día: dd
      recordDate.getDate().toString().padStart(2, '0')
    ].some(dateFormat => dateFormat.toLowerCase().includes(q))

    return basicMatch || dateMatches
  })

  return { records: filtered, loading }
}


