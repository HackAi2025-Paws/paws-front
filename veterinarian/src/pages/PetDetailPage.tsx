import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePatientDetail } from '../hooks/usePatientDetail'
import { usePatientExport } from '../hooks/usePatientExport'
import PatientSidebar from '../components/patient/PatientSidebar'
import PatientTabs from '../components/patient/PatientTabs'
import PatientExportModal from '../components/patient/PatientExportModal'
import AddRecordForm from '../components/patient/AddRecordForm'
import type { PatientRecord } from '../modules/patients/types'

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null)
  const [openExport, setOpenExport] = useState(false)
  const [activeTab, setActiveTab] = useState('resumen')

  // Custom hooks for data and business logic
  const {
    patient,
    patientDetails,
    filteredRecords,
    loading,
    recordsLoading,
    error
  } = usePatientDetail(id, search)

  const {
    exportOptions,
    setExportOptions,
    isExporting,
    handleExport
  } = usePatientExport()

  const toggleRecordExpansion = (recordId: string) => {
    setExpandedRecordId(expandedRecordId === recordId ? null : recordId)
  }

  const handleExportClick = async () => {
    if (!id) return
    await handleExport(id)
    setOpenExport(false)
  }

  const handleSaveRecord = (data: any) => {
    console.log('Guardando entrada:', data)
    // Aquí se implementaría la lógica para guardar la entrada
  }

  const handleVoiceInput = () => {
    console.log('Iniciando dictado por voz')
    // Aquí se implementaría la funcionalidad de dictado por voz
  }

  // Mock clinical summary - can be replaced with hook later
  const mockClinicalSummary = {
    keyFindings: [
      "Peso estable en 28kg, dentro del rango ideal para la raza",
      "Vacunación completa y al día según calendario",
      "Sin antecedentes de enfermedades graves o crónicas",
      "Respuesta positiva a tratamientos preventivos"
    ],
    recommendations: [
      "Continuar con controles preventivos cada 6 meses",
      "Mantener dieta balanceada y ejercicio regular",
      "Actualizar vacunación antirrábica en marzo 2024",
      "Monitorear peso durante controles de rutina"
    ],
    medicalHistory: "Golden Retriever de 3 años sin antecedentes médicos relevantes. Ha recibido todas las vacunas según calendario, incluyendo vacunas básicas (DHPP, antirrábica) y adicionales (Lyme, Bordetella). Último tratamiento antiparasitario en noviembre 2023. Procedimientos realizados incluyen limpieza dental y extracciones menores sin complicaciones.",
    riskFactors: [
      "Predisposición racial a displasia de cadera (monitoreado)",
      "Tendencia al sobrepeso en la raza (peso controlado)",
      "Riesgo de problemas cardíacos hereditarios (evaluación preventiva)"
    ]
  }

  // Error handling
  if (error) {
    return (
      <div className="petPage">
        <div className="petPage__left">
          <div className="petPage__nav">
            <button className="backNavButton" onClick={() => navigate(-1)}>
              ←
            </button>
            <div className="appTitle">PawsCare</div>
          </div>
        </div>
        <div className="petPage__content">
          <div className="muted">Error: {error}</div>
        </div>
      </div>
    )
  }

  if (loading) return <div className="petPage">Cargando…</div>
  if (!patient) return (
    <div className="petPage">
      <button className="linkButton" onClick={() => navigate(-1)}>Volver</button>
      <div className="muted">Paciente no encontrado.</div>
    </div>
  )

  return (
    <div className="petPage">
      <div className="petPage__left">
        <div className="petPage__nav">
          <button className="backNavButton" onClick={() => navigate(-1)}>
            ←
          </button>
          <div className="appTitle">PawsCare</div>
        </div>
        <PatientSidebar
          patient={patient}
          patientDetails={patientDetails}
          onExportClick={() => setOpenExport(true)}
        />
      </div>

      <div className="petPage__content">

        <PatientTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === 'resumen' && (
          <div className="tabContent">
            <div className="clinicalSummary">



              <div className="summaryGrid">

                <div className="summarySection">
                  <h4 className="summarySection__title">📋 Historia Clínica</h4>
                  <div className="summarySection__content">
                    <p>{mockClinicalSummary.medicalHistory}</p>
                  </div>
                </div>

                <div className="summarySection">
                  <h4 className="summarySection__title">✅ Hallazgos Clave</h4>
                  <div className="summarySection__content">
                    <ul className="summaryList">
                      {mockClinicalSummary.keyFindings.map((finding, index) => (
                        <li key={index} className="summaryList__item">
                          <span className="summaryList__icon">•</span>
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="summarySection">
                  <h4 className="summarySection__title">💡 Recomendaciones</h4>
                  <div className="summarySection__content">
                    <ul className="summaryList">
                      {mockClinicalSummary.recommendations.map((rec, index) => (
                        <li key={index} className="summaryList__item">
                          <span className="summaryList__icon">→</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="summarySection">
                  <h4 className="summarySection__title">⚠️ Factores de Riesgo</h4>
                  <div className="summarySection__content">
                    <ul className="summaryList">
                      {mockClinicalSummary.riskFactors.map((risk, index) => (
                        <li key={index} className="summaryList__item summaryList__item--risk">
                          <span className="summaryList__icon">!</span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>

              <div className="summaryFooter">
                <div className="summaryNote">
                  🤖 <em>Resumen generado automáticamente basado en el historial clínico completo del paciente.</em>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'historia' && (
          <div className="tabContent">
            <div className="search">
              <span className="search__icon" aria-hidden>🔎</span>
              <input
                className="search__input"
                placeholder="Buscar en historial clínico..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="recordList historiaList">
              {recordsLoading && <div className="muted">Cargando…</div>}
              {!recordsLoading && filteredRecords.map((record: PatientRecord) => (
                <div key={record.id} className={`expandableRecord ${expandedRecordId === record.id ? 'expandableRecord--expanded' : ''}`}>
                  <div className="recordItem" onClick={() => toggleRecordExpansion(record.id)}>
                    <div className="recordItem__icon">
                      {record.type === 'Vacunación' ? '💉' : record.type === 'Tratamiento' ? '🧪' : '🩺'}
                    </div>
                    <div className="recordItem__body">
                      <div className="recordItem__title">{record.title}</div>
                      <div className="recordItem__meta">
                        {new Date(record.date).toLocaleDateString()} · {record.doctor}
                      </div>
                    </div>
                    <div className="recordItem__actions">
                      <div className="expandIcon">
                        {expandedRecordId === record.id ? '▲' : '▼'}
                      </div>
                      <span className="badge">{record.type}</span>
                    </div>
                  </div>

                  {expandedRecordId === record.id && (
                    <div className="recordExpansion">
                      <div className="recordExpansion__content">

                        <div className="recordExpansion__section">
                          <h4 className="recordExpansion__sectionTitle">🔍 Hallazgos (Examen físico)</h4>
                          <p className="recordExpansion__text">
                            {[
                              record.temperature && `Temperatura: ${record.temperature}`,
                              record.weight && `Peso: ${record.weight}`,
                              record.heartRate && `Frecuencia cardíaca: ${record.heartRate}`
                            ].filter(Boolean).join('. ') || (record.type === 'Consulta'
                              ? 'Examen físico completo realizado. Mucosas rosadas y húmedas, hidratación adecuada. Auscultación cardiopulmonar normal. Palpación abdominal sin alteraciones. Temperatura corporal dentro de parámetros normales.'
                              : record.type === 'Vacunación'
                                ? 'Evaluación previa a vacunación: animal en buen estado general, temperatura normal, sin signos de enfermedad. Condición física apropiada para inmunización.'
                                : 'Evaluación física específica para procedimiento. Signos vitales estables, condición general satisfactoria. Sin contraindicaciones para tratamiento propuesto.'
                              )}
                          </p>
                        </div>

                        <div className="recordExpansion__section">
                          <h4 className="recordExpansion__sectionTitle">🩺 Diagnóstico</h4>
                          <p className="recordExpansion__text">
                            {record.type === 'Consulta'
                              ? 'Paciente presenta buen estado general de salud. No se observan signos de enfermedad o malestar. Todos los parámetros evaluados se encuentran dentro de los rangos normales para la especie y edad del animal.'
                              : record.type === 'Vacunación'
                                ? 'Animal en condiciones óptimas para recibir inmunización. No se observan contraindicaciones ni antecedentes de reacciones adversas a vacunaciones previas.'
                                : 'Evaluación completa realizada. Condición del paciente estable y apropiada para el procedimiento programado. Se confirma indicación médica para el tratamiento propuesto.'
                            }
                          </p>
                        </div>

                        <div className="recordExpansion__section">
                          <h4 className="recordExpansion__sectionTitle">💊 Tratamiento</h4>
                          <p className="recordExpansion__text">
                            {record.medication || (record.type === 'Consulta'
                              ? 'Se recomienda continuar con dieta balanceada y ejercicio regular. Mantener rutina de cuidados preventivos. Suplementación vitamínica según necesidades específicas de la raza y edad.'
                              : record.type === 'Vacunación'
                                ? 'No se requiere medicación post-vacunación. Observar al animal por 24-48 horas para detectar posibles reacciones. Evitar baños y ejercicio intenso las primeras 48 horas.'
                                : 'Plan terapéutico establecido según condición específica del paciente. Seguimiento de evolución mediante controles programados. Ajuste de dosis según respuesta clínica y peso corporal.'
                            )}
                          </p>
                        </div>

                        <div className="recordExpansion__section">
                          <h4 className="recordExpansion__sectionTitle">📋 Próximos pasos</h4>
                          <p className="recordExpansion__text">
                            {record.nextAppointment
                              ? `Control programado para: ${new Date(record.nextAppointment).toLocaleDateString()}. Evaluación de evolución y ajuste de tratamiento según corresponda.`
                              : (record.type === 'Consulta'
                                ? 'Programar control preventivo en 6 meses. Contactar clínica ante cualquier cambio en comportamiento, apetito o actividad. Mantener calendario de vacunación y desparasitación actualizado.'
                                : record.type === 'Vacunación'
                                  ? 'Próxima vacunación según calendario: revisar fechas de refuerzo anual. Agendar control general en 3-4 meses. Actualizar cartilla sanitaria con fecha y lote de vacuna aplicada.'
                                  : 'Seguimiento personalizado según evolución del caso. Control post-tratamiento en 7-10 días. Evaluación de respuesta terapéutica y posibles ajustes en próxima visita.'
                              )}
                          </p>
                        </div>

                        <div className="recordExpansion__section">
                          <h4 className="recordExpansion__sectionTitle">📝 Notas adicionales</h4>
                          <p className="recordExpansion__text">
                            {[
                              record.description && record.description,
                              record.anesthesia && `Anestesia utilizada: ${record.anesthesia}`,
                              record.duration && `Duración del procedimiento: ${record.duration}`
                            ].filter(Boolean).join('. ') || (record.type === 'Consulta'
                              ? 'Propietario informado sobre estado de salud del animal y recomendaciones de cuidado. Animal colaborativo durante examen. Se entregan indicaciones por escrito.'
                              : record.type === 'Vacunación'
                                ? 'Vacunación realizada sin complicaciones. Propietario instruido sobre cuidados post-vacunación y signos de alarma. Certificado de vacunación actualizado y entregado.'
                                : 'Procedimiento completado satisfactoriamente. Propietario informado sobre cuidados específicos post-tratamiento. Se establece plan de seguimiento personalizado.'
                              )}
                          </p>
                        </div>

                        {record.nextAppointment && (
                          <div className="recordExpansion__footer">
                            📅 <strong>Próxima cita:</strong> {new Date(record.nextAppointment).toLocaleDateString()}
                          </div>
                        )}

                        {record.attachments && record.attachments.length > 0 && (
                          <div className="recordExpansion__attachments">
                            <h5>📎 Archivos adjuntos</h5>
                            {record.attachments.map((attachment) => (
                              <a key={attachment.id} href={attachment.url} className="attachment__link">
                                📄 {attachment.name}
                              </a>
                            ))}
                          </div>
                        )}

                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'vacunas' && (
          <div className="tabContent">
            <div className="recordList vacunasList">
              <div className="vaccineItem">
                <div className="vaccineItem__icon">💉</div>
                <div className="vaccineItem__body">
                  <div className="vaccineItem__title">DHPP</div>
                  <div className="vaccineItem__meta">9/12/2023</div>
                </div>
                <div className="vaccineItem__right">
                  <span className="vaccineBadge vaccineBadge--current">Al día</span>
                </div>
              </div>

              <div className="vaccineItem">
                <div className="vaccineItem__icon">💉</div>
                <div className="vaccineItem__body">
                  <div className="vaccineItem__title">Antirrábica</div>
                  <div className="vaccineItem__meta">9/12/2023</div>
                </div>
                <div className="vaccineItem__right">
                  <span className="vaccineBadge vaccineBadge--current">Al día</span>
                </div>
              </div>

              <div className="vaccineItem">
                <div className="vaccineItem__icon">💉</div>
                <div className="vaccineItem__body">
                  <div className="vaccineItem__title">Tos de las perreras</div>
                  <div className="vaccineItem__meta">14/6/2023</div>
                </div>
                <div className="vaccineItem__right">
                  <span className="vaccineBadge vaccineBadge--expired">Vencida</span>
                </div>
              </div>

              <div className="vaccineItem">
                <div className="vaccineItem__icon">💉</div>
                <div className="vaccineItem__body">
                  <div className="vaccineItem__title">Bordetella</div>
                  <div className="vaccineItem__meta">15/8/2023</div>
                </div>
                <div className="vaccineItem__right">
                  <span className="vaccineBadge vaccineBadge--current">Al día</span>
                </div>
              </div>

              <div className="vaccineItem">
                <div className="vaccineItem__icon">💉</div>
                <div className="vaccineItem__body">
                  <div className="vaccineItem__title">Leptospirosis</div>
                  <div className="vaccineItem__meta">22/3/2023</div>
                </div>
                <div className="vaccineItem__right">
                  <span className="vaccineBadge vaccineBadge--expired">Vencida</span>
                </div>
              </div>

              <div className="vaccineItem">
                <div className="vaccineItem__icon">💉</div>
                <div className="vaccineItem__body">
                  <div className="vaccineItem__title">Parvovirus</div>
                  <div className="vaccineItem__meta">28/10/2023</div>
                </div>
                <div className="vaccineItem__right">
                  <span className="vaccineBadge vaccineBadge--current">Al día</span>
                </div>
              </div>

              <div className="vaccineItem">
                <div className="vaccineItem__icon">💉</div>
                <div className="vaccineItem__body">
                  <div className="vaccineItem__title">Coronavirus</div>
                  <div className="vaccineItem__meta">5/1/2023</div>
                </div>
                <div className="vaccineItem__right">
                  <span className="vaccineBadge vaccineBadge--expired">Vencida</span>
                </div>
              </div>

              <div className="vaccineItem">
                <div className="vaccineItem__icon">💉</div>
                <div className="vaccineItem__body">
                  <div className="vaccineItem__title">Lyme</div>
                  <div className="vaccineItem__meta">18/11/2023</div>
                </div>
                <div className="vaccineItem__right">
                  <span className="vaccineBadge vaccineBadge--current">Al día</span>
                </div>
              </div>

              <div className="vaccineItem">
                <div className="vaccineItem__icon">💉</div>
                <div className="vaccineItem__body">
                  <div className="vaccineItem__title">Giardia</div>
                  <div className="vaccineItem__meta">12/4/2023</div>
                </div>
                <div className="vaccineItem__right">
                  <span className="vaccineBadge vaccineBadge--expired">Vencida</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agregar' && (
          <div className="tabContent addFormLayout">
            <div className="recordList addFormContainer">
              <AddRecordForm
                onSave={handleSaveRecord}
                onVoiceInput={handleVoiceInput}
              />
            </div>
            <div className="formActionsExternal">
              <button className="btn btn--ghost voiceBtn" onClick={handleVoiceInput}>
                🎤 Dictar por voz
              </button>
              <button className="btn btn--primary" onClick={handleSaveRecord}>
                Guardar Entrada
              </button>
            </div>
          </div>
        )}
      </div>

      <PatientExportModal
        open={openExport}
        onClose={() => setOpenExport(false)}
        exportOptions={exportOptions}
        onExportOptionsChange={setExportOptions}
        onExport={handleExportClick}
        isLoading={isExporting}
      />

    </div>
  )
}


