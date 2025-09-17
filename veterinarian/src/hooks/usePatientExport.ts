import { useState } from 'react'
import type { ExportOptions } from '../modules/patients/types'
import type { PatientService } from '../services/patientService'
import { getPatientService } from '../services/patientService'

export interface UsePatientExportReturn {
  exportOptions: ExportOptions
  setExportOptions: (options: ExportOptions) => void
  isExporting: boolean
  handleExport: (patientId: string) => Promise<void>
}

export function usePatientExport(
  service: PatientService = getPatientService()
): UsePatientExportReturn {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    historia: true,
    vacunas: true,
    resumen: false
  })
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (patientId: string) => {
    const selectedOptions = Object.entries(exportOptions)
      .filter(([, selected]) => selected)
      .map(([key]) => key)

    if (selectedOptions.length === 0) {
      alert('Por favor selecciona al menos una opción para exportar')
      return
    }

    setIsExporting(true)

    try {
      await service.exportPatientData(patientId, selectedOptions)
    } catch (error) {
      console.error('Error exporting patient data:', error)
      alert('Error al exportar PDF. Por favor intenta nuevamente.')
    } finally {
      setIsExporting(false)
    }
  }

  return {
    exportOptions,
    setExportOptions,
    isExporting,
    handleExport
  }
}