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
      <div className="recordDetail recordDetail--wide">
        <div className="recordDetail__header">
          <h3 className="recordDetail__title">{record.title}</h3>
          <span className="recordDetail__badge">{record.type}</span>
        </div>
        <div className="recordDetail__meta">
          {new Date(record.date).toLocaleDateString()} · {record.doctor}
        </div>

        {record.description && (
          <div className="recordDetail__section">
            <h4 className="recordDetail__sectionTitle">Motivo de consulta</h4>
            <p className="recordDetail__text">{record.description}</p>
          </div>
        )}

        <div className="recordDetail__section">
          <h4 className="recordDetail__sectionTitle">Hallazgos (Examen físico)</h4>
          <p className="recordDetail__text">
            {[
              record.temperature && `Temperatura: ${record.temperature}`,
              record.weight && `Peso: ${record.weight}`,
              record.heartRate && `Frecuencia cardíaca: ${record.heartRate}`
            ].filter(Boolean).join('. ') || 'No se registraron hallazgos específicos.'}
          </p>
        </div>

        <div className="recordDetail__section">
          <h4 className="recordDetail__sectionTitle">Diagnóstico</h4>
          <p className="recordDetail__text">
            {record.type === 'Consulta'
              ? 'Paciente presenta buen estado general de salud. No se observan signos de enfermedad o malestar. Todos los parámetros evaluados se encuentran dentro de los rangos normales para la especie y edad del animal.'
              : record.type === 'Vacunación'
              ? 'Aplicación exitosa de vacuna. Animal en condiciones óptimas para recibir inmunización. No se observan contraindicaciones ni reacciones adversas previas a vacunaciones.'
              : 'Evaluación completa realizada. Condición del paciente estable y apropiada para el procedimiento programado. Se confirma indicación médica para el tratamiento propuesto.'
            }
          </p>
        </div>

        <div className="recordDetail__section">
          <h4 className="recordDetail__sectionTitle">Tratamiento</h4>
          <p className="recordDetail__text">
            {record.medication || (record.type === 'Consulta'
              ? 'Se recomienda continuar con dieta balanceada y ejercicio regular. Mantener rutina de cuidados preventivos. Control veterinario según calendario establecido.'
              : record.type === 'Vacunación'
              ? 'No se requiere medicación post-vacunación. Observar al animal por 24-48 horas para detectar posibles reacciones. Mantener en ambiente tranquilo las primeras horas.'
              : 'Plan terapéutico establecido según condición específica del paciente. Seguimiento de evolución mediante controles programados. Ajuste de tratamiento según respuesta clínica.'
            )}
          </p>
        </div>

        <div className="recordDetail__section">
          <h4 className="recordDetail__sectionTitle">Próximos pasos</h4>
          <p className="recordDetail__text">
            {record.nextAppointment
              ? `Próxima cita programada para: ${new Date(record.nextAppointment).toLocaleDateString()}`
              : (record.type === 'Consulta'
                ? 'Programar control de rutina en 6 meses. Contactar clínica ante cualquier cambio en comportamiento o apetito. Mantener calendario de vacunación actualizado.'
                : record.type === 'Vacunación'
                ? 'Próxima vacunación según calendario: revisar fechas de refuerzo. Agendar próximo control general en 3-4 meses. Mantener cartilla de vacunación actualizada.'
                : 'Seguimiento personalizado según evolución del caso. Control post-tratamiento programado. Evaluación de respuesta terapéutica en próxima visita.'
              )}
          </p>
        </div>

        <div className="recordDetail__section">
          <h4 className="recordDetail__sectionTitle">Notas adicionales</h4>
          <p className="recordDetail__text">
            {[
              record.anesthesia && `Anestesia utilizada: ${record.anesthesia}`,
              record.duration && `Duración del procedimiento: ${record.duration}`
            ].filter(Boolean).join('. ') || (record.type === 'Consulta'
              ? 'Propietario informado sobre estado de salud del animal. Se proporcionaron recomendaciones de cuidado y mantenimiento. Animal colaborativo durante examen clínico.'
              : record.type === 'Vacunación'
              ? 'Vacunación realizada sin complicaciones. Propietario instruido sobre cuidados post-vacunación. Certificado de vacunación actualizado y entregado.'
              : 'Procedimiento completado satisfactoriamente. Propietario informado sobre cuidados específicos. Se establece plan de seguimiento personalizado según caso.'
            )}
          </p>
        </div>

        {record.attachments && record.attachments.length > 0 && (
          <div className="recordDetail__section">
            <h4 className="recordDetail__sectionTitle">Archivos Adjuntos ({record.attachments.length})</h4>
            <div className="attachments">
              {record.attachments.map((attachment) => (
                <div key={attachment.id} className="attachment">
                  <span className="attachment__icon">📄</span>
                  <a href={attachment.url} className="attachment__link">
                    {attachment.name}
                  </a>
                  <a href={attachment.url} className="attachment__download">
                    ↓ Descargar
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