/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePetById } from '../hooks/usePets'
import { useClinicalSummary } from '../hooks/useClinicalSummary'
import PatientSidebar from '../components/patient/PatientSidebar'
import PatientTabs from '../components/patient/PatientTabs'
import PatientExportModal from '../components/patient/PatientExportModal'
import AddRecordForm from '../components/patient/AddRecordForm'
import SuggestionsPanel from '../components/patient/suggestions/SuggestionsPanel'
import MedicalTranscriptionBox from '../components/patient/MedicalTranscriptionBox'
import Spinner from '../components/ui/Spinner'
import type { Suggestion } from '../types/suggestions'
import { useSpeechToText } from '../hooks/useSpeechToText'
import './PetDetailPage.css'
import '../components/patient/PatientSidebar.css'
import '../components/patient/PatientTabs.css'
import '../components/patient/AddRecordForm.css'
import '../components/common/RecordList.css'
import '../components/patient/VaccinesList.css'
import { apiClient } from '../services/apiClient'
import type { Consultation } from '../types/consultations'

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Early validation - ID is required
  if (!id || id.trim() === '') {
    return (
      <div className="petPage">
        <div className="petPage__content" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          textAlign: 'center'
        }}>
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#ef4444',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #fecaca',
            maxWidth: '400px'
          }}>
            <h2>ID de mascota inválido</h2>
            <p>No se pudo encontrar el ID de la mascota en la URL.</p>
            <button
              className="btn btn--primary"
              onClick={() => navigate(-1)}
              style={{ marginTop: '16px' }}
            >
              ← Volver
            </button>
          </div>
        </div>
      </div>
    )
  }

  const petId = parseInt(id)
  const { pet: patient, loading, error } = usePetById(petId)
  const { summary: clinicalSummary, loading: summaryLoading, error: summaryError } = useClinicalSummary(petId)


  const [search, setSearch] = useState('')
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null)
  const [openExport, setOpenExport] = useState(false)
  const [activeTab, setActiveTab] = useState('resumen')
  const { finalText, toggleListening, isListening, clearText } = useSpeechToText();
  const [consultation, setConsultation] = useState<Consultation | null>(null)

  // hook que sirve para cuando si recibis me entendes osea para contar la cantidad de final texts (juli arregla tu hook)
  const [finalTextCounter, setFinalTextCounter] = useState(0);
  useEffect(() => {
    // me fijo si lo que si del resto si para ver si request si
    if (finalTextCounter > 0 && finalTextCounter % 4 === 0) {
      apiClient.post("/suggestions/questions", {
        "transcription": finalText
      }).then((response) => {
        if (response.success) {
          console.log(response.data);
        }
      });
    }
  }, [finalText, finalTextCounter]);

  useEffect(() => {
    setFinalTextCounter((prev) => prev + 1);
  }, [finalText]);

  // Transform pet data to match PatientSidebar expectations
  const patientDetails = patient ? {
    weight: patient.weight ? `${patient.weight}kg` : 'Peso no registrado',
    sex: patient.sex === 'MALE' ? 'Macho' : patient.sex === 'FEMALE' ? 'Hembra' : 'No especificado',
    birthDate: patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) : 'No especificado',
    ownerPhone: patient.owners && patient.owners.length > 0 ? patient.owners[0].phone : 'Sin teléfono',
    ownerEmail: 'No disponible'
  } : undefined

  // Transform consultations to records format
  const filteredRecords = patient?.consultations ? patient.consultations
    .filter((consultation: any) => {
      if (!search) return true
      return consultation.chiefComplaint.toLowerCase().includes(search.toLowerCase()) ||
             consultation.diagnosis?.toLowerCase().includes(search.toLowerCase())
    })
    .map((consultation: any) => ({
      id: consultation.id.toString(),
      title: consultation.chiefComplaint,
      date: consultation.date,
      doctor: consultation.user?.name || 'Dr. Desconocido',
      type: consultation.consultationType === 'VACCINATION' ? 'Vacunación' :
            consultation.consultationType === 'TREATMENT' ? 'Tratamiento' : 'Consulta',
      findings: consultation.findings,
      diagnosis: consultation.diagnosis,
      nextSteps: consultation.nextSteps,
      additionalNotes: consultation.additionalNotes
    })) : []

  const exportOptions = {
    format: 'pdf' as const,
    historia: true,
    vacunas: true,
    resumen: true
  }
  const setExportOptions = () => {}
  const isExporting = false

  const toggleRecordExpansion = (recordId: string) => {
    setExpandedRecordId(expandedRecordId === recordId ? null : recordId);
  };

  const handleExportClick = async () => {
    if (!id) return;
    setOpenExport(false);
  };

  const handleSaveRecord = (data: any) => {
    console.log("Guardando entrada:", data);
  };

  const handleVoiceInput = async () => {
    if (!isListening) {
      clearText();
    }
    toggleListening();
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    console.log('Sugerencia seleccionada:', suggestion)
  }

  const handleConsultationClick = (consultation: Consultation) => {
    setConsultation(consultation)
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
            <div className="appTitle">PetLink</div>
          </div>
        </div>
        <div className="petPage__content">
          <div className="muted">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: 'var(--background, #f8fafc)'
    }}>
      <Spinner size="large" text="Cargando información de la mascota..." />
    </div>
  );
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
            <div className="appTitle">PetLink</div>
          </div>
          <div className="patientSidebarContent">
            <PatientSidebar
              patient={{
                ...patient,
                ownerName: patient.owners?.[0]?.name || 'No especificado',
                avatarUrl: patient.profileImageUrl || `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${patient.name}&backgroundColor=c0aede`,
                age: patient.age || '5 años'
              }}
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
                    <h2 style={{ marginTop: 0, marginBottom: '16px', color: 'var(--text)', fontWeight: 600 }}>📋 Resumen Clínico</h2>

                    {summaryLoading && (
                      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                        <Spinner size="medium" text="Generando resumen clínico..." />
                      </div>
                    )}

                    {summaryError && (
                      <div style={{
                        padding: '20px',
                        backgroundColor: '#fee2e2',
                        color: '#ef4444',
                        borderRadius: '8px',
                        marginBottom: '16px'
                      }}>
                        Error al cargar el resumen clínico: {summaryError}
                      </div>
                    )}

                    {!summaryLoading && !summaryError && clinicalSummary && (
                      <>
                        <h3 style={{ margin: '0 0 8px 0', color: 'var(--brand-600)', fontWeight: 600 }}>📋 Información Básica</h3>
                        <p style={{ margin: '0 0 24px 0', color: 'var(--text)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                          {clinicalSummary.basic_information}
                        </p>

                        <h3 style={{ margin: '0 0 8px 0', color: 'var(--brand-600)', fontWeight: 600 }}>📚 Historial</h3>
                        <p style={{ margin: '0 0 24px 0', color: 'var(--text)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                          {clinicalSummary.history}
                        </p>

                        <h3 style={{ margin: '0 0 8px 0', color: 'var(--brand-600)', fontWeight: 600 }}>🩺 Última Consulta</h3>
                        <p style={{ margin: '0 0 16px 0', color: 'var(--text)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                          {clinicalSummary.last_consultation}
                        </p>
                      </>
                    )}

                    {!summaryLoading && !summaryError && !clinicalSummary && (
                      <div style={{
                        padding: '20px',
                        textAlign: 'center',
                        color: 'var(--muted)'
                      }}>
                        No hay resumen clínico disponible para esta mascota.
                      </div>
                    )}
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
                    {filteredRecords.length === 0 && (
                      <div className="muted">No hay consultas registradas.</div>
                    )}
                    {filteredRecords.map((record: any) => (
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
                            {record.type === "Vacunación" ? "💉" : record.type === "Tratamiento" ? "🧪" : "🩺"}
                          </div>
                          <div className="recordItem__body">
                            <div className="recordItem__title">{record.title}</div>
                            <div className="recordItem__meta">
                              {new Date(record.date).toLocaleDateString()} · {record.doctor}
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
                              {record.findings && (
                                <div className="recordExpansion__section">
                                  <h4 className="recordExpansion__sectionTitle">🔍 Hallazgos</h4>
                                  <p className="recordExpansion__text">{record.findings}</p>
                                </div>
                              )}

                              {record.diagnosis && (
                                <div className="recordExpansion__section">
                                  <h4 className="recordExpansion__sectionTitle">🩺 Diagnóstico</h4>
                                  <p className="recordExpansion__text">{record.diagnosis}</p>
                                </div>
                              )}

                              {record.nextSteps && (
                                <div className="recordExpansion__section">
                                  <h4 className="recordExpansion__sectionTitle">📋 Próximos pasos</h4>
                                  <p className="recordExpansion__text">{record.nextSteps}</p>
                                </div>
                              )}

                              {record.additionalNotes && (
                                <div className="recordExpansion__section">
                                  <h4 className="recordExpansion__sectionTitle">📝 Notas adicionales</h4>
                                  <p className="recordExpansion__text">{record.additionalNotes}</p>
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
                    {!patient.vaccines || patient.vaccines.length === 0 ? (
                      <div className="muted">No hay vacunas registradas.</div>
                    ) : (
                      patient.vaccines.map((vaccine: any) => (
                        <div key={vaccine.id} className="vaccineItem">
                          <div className="vaccineItem__icon">💉</div>
                          <div className="vaccineItem__body">
                            <div className="vaccineItem__title">{vaccine.vaccine.name}</div>
                            <div className="vaccineItem__meta">
                              {new Date(vaccine.applicationDate).toLocaleDateString()}
                              {vaccine.notes && ` - ${vaccine.notes}`}
                            </div>
                          </div>
                          <div className="vaccineItem__right">
                            <span className={`vaccineBadge ${
                              vaccine.expirationDate && new Date(vaccine.expirationDate) > new Date()
                                ? 'vaccineBadge--current'
                                : 'vaccineBadge--expired'
                            }`}>
                              {vaccine.expirationDate && new Date(vaccine.expirationDate) > new Date()
                                ? 'Al día'
                                : 'Vencida'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
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
                  flex: isListening ? '0 1 auto' : 1,
                  overflow: 'auto',
                  marginBottom: '16px'
                }} className="recordList">
                  <AddRecordForm
                    onSave={handleSaveRecord}
                    onVoiceInput={handleVoiceInput}
                    petId={id}
                    initialData={consultation ?? undefined}
                  />
                </div>

                <div className="formActionsExternal" style={{
                  height: '60px',
                  alignItems: 'center',
                  marginTop: 'auto'
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
              padding: '0'
            }}>
              <SuggestionsPanel
                transcription={finalText}
                onSuggestionClick={handleSuggestionClick}
                className="suggestions-panel"
                onConsultationClick={handleConsultationClick}
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