import Modal from '../ui/Modal'
import type { PatientRecord } from '../../modules/patients/types'

interface PatientRecordDetailModalProps {
  record: PatientRecord | null
  onClose: () => void
}

export default function PatientRecordDetailModal({ record, onClose }: PatientRecordDetailModalProps) {
  if (!record) return null

  return (
    <Modal open={!!record} onClose={onClose} title="Detalle de Consulta">
      <div className="recordDetail">
        <div className="recordDetail__header">
          <h3 className="recordDetail__title">{record.title}</h3>
          <span className="recordDetail__badge">{record.type}</span>
        </div>
        <div className="recordDetail__meta">
          {new Date(record.date).toLocaleDateString()} · {record.doctor}
        </div>

        {record.description && (
          <div className="recordDetail__section">
            <h4 className="recordDetail__sectionTitle">Descripción</h4>
            <p className="recordDetail__text">{record.description}</p>
          </div>
        )}


        {record.medication && (
          <div className="recordDetail__section">
            <h4 className="recordDetail__sectionTitle">Medicación</h4>
            <p className="recordDetail__text">{record.medication}</p>
          </div>
        )}

        {record.anesthesia && (
          <div className="recordDetail__section">
            <h4 className="recordDetail__sectionTitle">Anestesia</h4>
            <p className="recordDetail__text">{record.anesthesia}</p>
            {record.duration && (
              <p className="recordDetail__text">
                <strong>Duración:</strong> {record.duration}
              </p>
            )}
          </div>
        )}

        {record.nextAppointment && (
          <div className="recordDetail__section">
            <h4 className="recordDetail__sectionTitle">Próxima Cita</h4>
            <p className="recordDetail__text">
              {new Date(record.nextAppointment).toLocaleDateString()}
            </p>
          </div>
        )}

        {record.attachments && record.attachments.length > 0 && (
          <div className="recordDetail__section">
            <h4 className="recordDetail__sectionTitle">Archivos Adjuntos</h4>
            <div className="attachments">
              {record.attachments.map((attachment) => (
                <div key={attachment.id} className="attachment">
                  <span className="attachment__icon">📄</span>
                  <a href={attachment.url} className="attachment__link">
                    {attachment.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}