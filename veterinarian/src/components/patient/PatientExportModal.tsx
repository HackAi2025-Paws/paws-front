import Modal from '../ui/Modal'
import Checkbox from '../ui/Checkbox'
import type { ExportOptions } from '../../modules/patients/types'

interface PatientExportModalProps {
  open: boolean
  onClose: () => void
  exportOptions: ExportOptions
  onExportOptionsChange: (options: ExportOptions) => void
  onExport: () => void
  isLoading?: boolean
}

export default function PatientExportModal({
  open,
  onClose,
  exportOptions,
  onExportOptionsChange,
  onExport,
  isLoading = false
}: PatientExportModalProps) {
  const hasSelection = exportOptions.historia || exportOptions.vacunas || exportOptions.resumen || exportOptions.tratamientos

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Exportar a PDF"
      footer={
        <div className="centerRow">
          <button className="btn btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn btn--primary"
            disabled={!hasSelection || isLoading}
            onClick={onExport}
          >
            {isLoading ? 'Exportando...' : 'Exportar'}
          </button>
        </div>
      }
    >
      <div className="muted">
        Selecciona qué información deseas exportar
      </div>
      <div className="modalList">
        <Checkbox
          label="Historia Clínica Completa"
          checked={exportOptions.historia}
          onChange={(e) => onExportOptionsChange({
            ...exportOptions,
            historia: e.target.checked
          })}
        />
        <Checkbox
          label="Registro de Vacunas"
          checked={exportOptions.vacunas}
          onChange={(e) => onExportOptionsChange({
            ...exportOptions,
            vacunas: e.target.checked
          })}
        />
        <Checkbox
          label="Resumen del Paciente"
          checked={exportOptions.resumen}
          onChange={(e) => onExportOptionsChange({
            ...exportOptions,
            resumen: e.target.checked
          })}
        />
        <Checkbox
          label="Registro de Tratamientos"
          checked={exportOptions.tratamientos}
          onChange={(e) => onExportOptionsChange({
            ...exportOptions,
            tratamientos: e.target.checked
          })}
        />
      </div>
    </Modal>
  )
}