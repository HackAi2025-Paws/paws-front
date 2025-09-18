/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePatientDetail } from '../hooks/usePatientDetail'
import { usePatientExport } from '../hooks/usePatientExport'
import PatientSidebar from '../components/patient/PatientSidebar'
import PatientTabs from '../components/patient/PatientTabs'
import PatientExportModal from '../components/patient/PatientExportModal'
import AddRecordForm from '../components/patient/AddRecordForm'
import SuggestionsPanel from '../components/patient/suggestions/SuggestionsPanel'
import MedicalTranscriptionBox from '../components/patient/MedicalTranscriptionBox'
import type { PatientRecord } from '../modules/patients/types'
import type { Suggestion } from '../types/suggestions'
import { useSpeechToText } from '../hooks/useSpeechToText'
import './PetDetailPage.css'
import '../components/patient/PatientSidebar.css'
import '../components/patient/PatientTabs.css'
import '../components/patient/AddRecordForm.css'
import '../components/common/RecordList.css'
import '../components/patient/VaccinesList.css'

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null)
  const [openExport, setOpenExport] = useState(false)
  const [activeTab, setActiveTab] = useState('resumen')
  const { finalText, toggleListening, isListening, clearText } = useSpeechToText();

  // Custom hooks for data and business logic
  const {
    patient,
    patientDetails,
    filteredRecords,
    loading,
    recordsLoading,
    error,
  } = usePatientDetail(id, search);

  const { exportOptions, setExportOptions, isExporting, handleExport } =
    usePatientExport();

  const toggleRecordExpansion = (recordId: string) => {
    setExpandedRecordId(expandedRecordId === recordId ? null : recordId);
  };

  const handleExportClick = async () => {
    if (!id) return;
    await handleExport(id);
    setOpenExport(false);
  };

  const handleSaveRecord = (data: any) => {
    console.log("Guardando entrada:", data);
    // Aquí se implementaría la lógica para guardar la entrada
  };

  const handleVoiceInput = async () => {
    if (!isListening) {
      clearText();
    }
    toggleListening();
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    console.log('Sugerencia seleccionada:', suggestion)
    // TODO: Implement logic to use the suggestion in the form
    // This could copy the suggestion text to clipboard or trigger a form action
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
    );
  }

  if (loading) return <div className="petPage">Cargando…</div>;
  if (!patient)
    return (
      <div className="petPage">
        <button className="linkButton" onClick={() => navigate(-1)}>
          Volver
        </button>
        <div className="muted">Paciente no encontrado.</div>
      </div>
    );

  return (
    <div className={`petDetailPage ${isListening ? 'petDetailPage--listening' : 'petDetailPage--normal'}`}>

      {/* Main container with horizontal content and medical transcription box */}
      <div className={`mainContainer ${isListening ? 'mainContainer--listening' : ''}`} style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden'
      }}>

        {/* Horizontal content container with sections 1, 2, and 3 */}
        <div style={{
          display: 'flex',
          flex: '1',
          minHeight: 0,
          overflow: 'hidden'
        }}>

        {/* Section 1: Patient Record + Navigation */}
        <div className="patientSection">
          <div className="petPage__nav patientNavigation">
            <button className="backNavButton" onClick={() => navigate(-1)}>
              ←
            </button>
            <div className="appTitle">PawsCare</div>
          </div>
          <div className="patientSidebarContent">
            <PatientSidebar
              patient={patient}
              patientDetails={patientDetails}
              onExportClick={() => setOpenExport(true)}
            />
          </div>
        </div>

        {/* Section 2: Tabs + Content */}
        <div className={`contentSection ${isListening && activeTab === 'agregar' ? 'contentSection--withSuggestions' : ''}`}>
          <div className="tabsContainer">
            <PatientTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          <div className={`contentBody ${isListening ? 'contentBody--listening' : 'contentBody--normal'}`}>

            {activeTab === 'resumen' && (
              <div className="tabContentContainer">
                <div className="tabContent">
                  <div className="recordList">
                    <h2 style={{ marginTop: 0, marginBottom: '16px', color: 'var(--text)', fontWeight: 600 }}>📋 Antecedentes Médicos</h2>

                    <h3 style={{ margin: '0 0 4px 0', color: 'var(--brand-600)', fontWeight: 600 }}>Vacunación y Desparasitación</h3>
                    <p style={{ margin: '0 0 16px 0', color: 'var(--text)', lineHeight: '1.4' }}>Esquema completo de vacunación al día. Última vacuna DHPP y antirrábica aplicada en diciembre 2023. Tos de las perreras vencida desde junio 2023.</p>

                    <h3 style={{ margin: '0 0 4px 0', color: 'var(--brand-600)', fontWeight: 600 }}>Enfermedades Previas</h3>
                    <p style={{ margin: '0 0 16px 0', color: 'var(--text)', lineHeight: '1.4' }}>Sin enfermedades graves previas. Historial de salud excelente desde cachorro.</p>

                    <h3 style={{ margin: '0 0 4px 0', color: 'var(--brand-600)', fontWeight: 600 }}>Cirugías</h3>
                    <p style={{ margin: '0 0 16px 0', color: 'var(--text)', lineHeight: '1.4' }}>Sin cirugías previas registradas.</p>

                    <h3 style={{ margin: '0 0 4px 0', color: 'var(--brand-600)', fontWeight: 600 }}>Alergias Conocidas</h3>
                    <p style={{ margin: '0 0 16px 0', color: 'var(--text)', lineHeight: '1.4' }}>No se han identificado alergias conocidas a medicamentos o alimentos.</p>

                    <h3 style={{ margin: '0 0 4px 0', color: 'var(--brand-600)', fontWeight: 600 }}>Medicación Actual</h3>
                    <p style={{ margin: '0 0 24px 0', color: 'var(--text)', lineHeight: '1.4' }}>Sin medicación crónica. Tratamiento antiparasitario preventivo cada 3 meses.</p>

                    <h2 style={{ marginTop: 0, marginBottom: '16px', color: 'var(--text)', fontWeight: 600 }}>🩺 Consulta último evento</h2>

                    <h3 style={{ margin: '0 0 4px 0', color: 'var(--brand-600)', fontWeight: 600 }}>Motivo de la consulta / síntomas observados</h3>
                    <p style={{ margin: '0 0 16px 0', color: 'var(--text)', lineHeight: '1.4' }}>Control preventivo de rutina. Propietario refiere que el animal se encuentra en buen estado general, con apetito normal y actividad habitual. Sin síntomas aparentes de enfermedad.</p>

                    <h3 style={{ margin: '0 0 4px 0', color: 'var(--brand-600)', fontWeight: 600 }}>Hallazgos relevantes del examen clínico</h3>
                    <p style={{ margin: '0 0 16px 0', color: 'var(--text)', lineHeight: '1.4' }}>Peso estable en 28kg, dentro del rango ideal para la raza. Mucosas rosadas y húmedas, hidratación adecuada. Auscultación cardiopulmonar normal. Temperatura corporal dentro de parámetros normales (38.5°C). Palpación abdominal sin alteraciones.</p>

                    <h3 style={{ margin: '0 0 4px 0', color: 'var(--brand-600)', fontWeight: 600 }}>Diagnóstico</h3>
                    <p style={{ margin: '0 0 16px 0', color: 'var(--text)', lineHeight: '1.4' }}>Paciente en buen estado general de salud. Sin signos de enfermedad o malestar detectados. Todos los parámetros evaluados se encuentran dentro de los rangos normales para la especie y edad.</p>

                    <h3 style={{ margin: '0 0 4px 0', color: 'var(--brand-600)', fontWeight: 600 }}>Tratamiento indicado o recomendaciones</h3>
                    <p style={{ margin: '0 0 16px 0', color: 'var(--text)', lineHeight: '1.4' }}>Continuar con dieta balanceada y ejercicio regular. Mantener rutina de cuidados preventivos. Próximo control programado en 6 meses. Actualizar vacunación antirrábica en marzo 2024. Monitorear peso durante controles de rutina.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'historia' && (
              <div className="tabContentContainer">
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
                    {!recordsLoading &&
                      filteredRecords.map((record: PatientRecord) => (
                        <div
                          key={record.id}
                          className={`expandableRecord ${expandedRecordId === record.id
                            ? "expandableRecord--expanded"
                            : ""
                            }`}
                        >
                          <div
                            className="recordItem"
                            onClick={() => toggleRecordExpansion(record.id)}
                          >
                            <div className="recordItem__icon">
                              {record.type === "Vacunación"
                                ? "💉"
                                : record.type === "Tratamiento"
                                  ? "🧪"
                                  : "🩺"}
                            </div>
                            <div className="recordItem__body">
                              <div className="recordItem__title">{record.title}</div>
                              <div className="recordItem__meta">
                                {new Date(record.date).toLocaleDateString()} ·{" "}
                                {record.doctor}
                              </div>
                            </div>
                            <div className="recordItem__actions">
                              <div className="expandIcon">
                                {expandedRecordId === record.id ? "▲" : "▼"}
                              </div>
                              <span className="badge">{record.type}</span>
                            </div>
                          </div>

                          {expandedRecordId === record.id && (
                            <div className="recordExpansion">
                              <div className="recordExpansion__content">
                                <div className="recordExpansion__section">
                                  <h4 className="recordExpansion__sectionTitle">
                                    🔍 Hallazgos (Examen físico)
                                  </h4>
                                  <p className="recordExpansion__text">
                                    {[
                                      record.temperature &&
                                      `Temperatura: ${record.temperature}`,
                                      record.weight && `Peso: ${record.weight}`,
                                      record.heartRate &&
                                      `Frecuencia cardíaca: ${record.heartRate}`,
                                    ]
                                      .filter(Boolean)
                                      .join(". ") ||
                                      (record.type === "Consulta"
                                        ? "Examen físico completo realizado. Mucosas rosadas y húmedas, hidratación adecuada. Auscultación cardiopulmonar normal. Palpación abdominal sin alteraciones. Temperatura corporal dentro de parámetros normales."
                                        : record.type === "Vacunación"
                                          ? "Evaluación previa a vacunación: animal en buen estado general, temperatura normal, sin signos de enfermedad. Condición física apropiada para inmunización."
                                          : "Evaluación física específica para procedimiento. Signos vitales estables, condición general satisfactoria. Sin contraindicaciones para tratamiento propuesto.")}
                                  </p>
                                </div>

                                <div className="recordExpansion__section">
                                  <h4 className="recordExpansion__sectionTitle">
                                    🩺 Diagnóstico
                                  </h4>
                                  <p className="recordExpansion__text">
                                    {record.type === "Consulta"
                                      ? "Paciente presenta buen estado general de salud. No se observan signos de enfermedad o malestar. Todos los parámetros evaluados se encuentran dentro de los rangos normales para la especie y edad del animal."
                                      : record.type === "Vacunación"
                                        ? "Animal en condiciones óptimas para recibir inmunización. No se observan contraindicaciones ni antecedentes de reacciones adversas a vacunaciones previas."
                                        : "Evaluación completa realizada. Condición del paciente estable y apropiada para el procedimiento programado. Se confirma indicación médica para el tratamiento propuesto."}
                                  </p>
                                </div>

                                <div className="recordExpansion__section">
                                  <h4 className="recordExpansion__sectionTitle">
                                    💊 Tratamiento
                                  </h4>
                                  <p className="recordExpansion__text">
                                    {record.medication ||
                                      (record.type === "Consulta"
                                        ? "Se recomienda continuar con dieta balanceada y ejercicio regular. Mantener rutina de cuidados preventivos. Suplementación vitamínica según necesidades específicas de la raza y edad."
                                        : record.type === "Vacunación"
                                          ? "No se requiere medicación post-vacunación. Observar al animal por 24-48 horas para detectar posibles reacciones. Evitar baños y ejercicio intenso las primeras 48 horas."
                                          : "Plan terapéutico establecido según condición específica del paciente. Seguimiento de evolución mediante controles programados. Ajuste de dosis según respuesta clínica y peso corporal.")}
                                  </p>
                                </div>

                                <div className="recordExpansion__section">
                                  <h4 className="recordExpansion__sectionTitle">
                                    📋 Próximos pasos
                                  </h4>
                                  <p className="recordExpansion__text">
                                    {record.nextAppointment
                                      ? `Control programado para: ${new Date(
                                        record.nextAppointment
                                      ).toLocaleDateString()}. Evaluación de evolución y ajuste de tratamiento según corresponda.`
                                      : record.type === "Consulta"
                                        ? "Programar control preventivo en 6 meses. Contactar clínica ante cualquier cambio en comportamiento, apetito o actividad. Mantener calendario de vacunación y desparasitación actualizado."
                                        : record.type === "Vacunación"
                                          ? "Próxima vacunación según calendario: revisar fechas de refuerzo anual. Agendar control general en 3-4 meses. Actualizar cartilla sanitaria con fecha y lote de vacuna aplicada."
                                          : "Seguimiento personalizado según evolución del caso. Control post-tratamiento en 7-10 días. Evaluación de respuesta terapéutica y posibles ajustes en próxima visita."}
                                  </p>
                                </div>

                                <div className="recordExpansion__section">
                                  <h4 className="recordExpansion__sectionTitle">
                                    📝 Notas adicionales
                                  </h4>
                                  <p className="recordExpansion__text">
                                    {[
                                      record.description && record.description,
                                      record.anesthesia &&
                                      `Anestesia utilizada: ${record.anesthesia}`,
                                      record.duration &&
                                      `Duración del procedimiento: ${record.duration}`,
                                    ]
                                      .filter(Boolean)
                                      .join(". ") ||
                                      (record.type === "Consulta"
                                        ? "Propietario informado sobre estado de salud del animal y recomendaciones de cuidado. Animal colaborativo durante examen. Se entregan indicaciones por escrito."
                                        : record.type === "Vacunación"
                                          ? "Vacunación realizada sin complicaciones. Propietario instruido sobre cuidados post-vacunación y signos de alarma. Certificado de vacunación actualizado y entregado."
                                          : "Procedimiento completado satisfactoriamente. Propietario informado sobre cuidados específicos post-tratamiento. Se establece plan de seguimiento personalizado.")}
                                  </p>
                                </div>

                                {record.nextAppointment && (
                                  <div className="recordExpansion__footer">
                                    📅 <strong>Próxima cita:</strong>{" "}
                                    {new Date(
                                      record.nextAppointment
                                    ).toLocaleDateString()}
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
              </div>
            )}

            {activeTab === 'vacunas' && (
              <div className="tabContentContainer">
                <div className="tabContent">
                  <div className="recordList vacunasList">
                    <div className="vaccineItem">
                      <div className="vaccineItem__icon">💉</div>
                      <div className="vaccineItem__body">
                        <div className="vaccineItem__title">DHPP</div>
                        <div className="vaccineItem__meta">9/12/2023</div>
                      </div>
                      <div className="vaccineItem__right">
                        <span className="vaccineBadge vaccineBadge--current">
                          Al día
                        </span>
                      </div>
                    </div>

                    <div className="vaccineItem">
                      <div className="vaccineItem__icon">💉</div>
                      <div className="vaccineItem__body">
                        <div className="vaccineItem__title">Antirrábica</div>
                        <div className="vaccineItem__meta">9/12/2023</div>
                      </div>
                      <div className="vaccineItem__right">
                        <span className="vaccineBadge vaccineBadge--current">
                          Al día
                        </span>
                      </div>
                    </div>

                    <div className="vaccineItem">
                      <div className="vaccineItem__icon">💉</div>
                      <div className="vaccineItem__body">
                        <div className="vaccineItem__title">Leptospirosis</div>
                        <div className="vaccineItem__meta">22/3/2023</div>
                      </div>
                      <div className="vaccineItem__right">
                        <span className="vaccineBadge vaccineBadge--expired">
                          Vencida
                        </span>
                      </div>
                    </div>

                    <div className="vaccineItem">
                      <div className="vaccineItem__icon">💉</div>
                      <div className="vaccineItem__body">
                        <div className="vaccineItem__title">Parvovirus</div>
                        <div className="vaccineItem__meta">28/10/2023</div>
                      </div>
                      <div className="vaccineItem__right">
                        <span className="vaccineBadge vaccineBadge--current">
                          Al día
                        </span>
                      </div>
                    </div>

                    <div className="vaccineItem">
                      <div className="vaccineItem__icon">💉</div>
                      <div className="vaccineItem__body">
                        <div className="vaccineItem__title">Coronavirus</div>
                        <div className="vaccineItem__meta">5/1/2023</div>
                      </div>
                      <div className="vaccineItem__right">
                        <span className="vaccineBadge vaccineBadge--expired">
                          Vencida
                        </span>
                      </div>
                    </div>

                    <div className="vaccineItem">
                      <div className="vaccineItem__icon">💉</div>
                      <div className="vaccineItem__body">
                        <div className="vaccineItem__title">Lyme</div>
                        <div className="vaccineItem__meta">18/11/2023</div>
                      </div>
                      <div className="vaccineItem__right">
                        <span className="vaccineBadge vaccineBadge--current">
                          Al día
                        </span>
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
              </div>
            )}

            {activeTab === 'agregar' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}>
                <div style={{
                  flex: isListening ? '0 1 auto' : 1, // Don't grow when listening, allow shrinking
                  overflow: 'auto', // Scroll only if needed
                  marginBottom: '16px' // Space between form and buttons
                }} className="recordList">
                  <AddRecordForm
                    onSave={handleSaveRecord}
                    onVoiceInput={handleVoiceInput}
                  />
                </div>

                {/* Buttons bar outside container */}
                <div className="formActionsExternal" style={{
                  height: '60px', // Fixed height to make it shorter
                  alignItems: 'center', // Center buttons vertically
                  marginTop: 'auto' // Push to bottom
                }}>
                  <button
                    className={`btn ${isListening ? 'btn--danger' : 'btn--ghost'} voiceBtn`}
                    onClick={handleVoiceInput}
                    style={{
                      backgroundColor: isListening ? '#ef4444' : undefined,
                      color: isListening ? 'white' : undefined
                    }}
                  >
                    {isListening ? '⏹️ Parar grabación' : '🎤 Dictar por voz'}
                  </button>
                  <button className="btn btn--primary" onClick={handleSaveRecord}>
                    Guardar Entrada
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Section 3: Suggestions Panel (conditional) */}
        {isListening && activeTab === 'agregar' && (
          <div style={{
            width: '400px',
            flexShrink: 0,
            backgroundColor: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>

            <div style={{
              flex: 1,
              overflow: 'auto',
              padding: '0' // Same as tabs content containers (no padding in container)
            }}>
              <SuggestionsPanel
                transcription={finalText}
                onSuggestionClick={handleSuggestionClick}
                className="suggestions-panel"
              />
            </div>
          </div>
        )}

        </div>

        {/* Medical Transcription Box (appears when listening) */}
        {isListening && (
          <div style={{
            flexShrink: 0,
            height: 'auto',
            maxHeight: '20vh',
            overflow: 'auto'
          }}>
            <MedicalTranscriptionBox
              transcription={finalText}
              shouldProcess={false}
              onProcessed={(processedText) => {
                console.log('Medical transcription processed:', processedText)
              }}
              onError={(error) => {
                console.error('Medical transcription error:', error)
              }}
            />
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
  );
}
