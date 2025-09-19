/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePetById } from '../hooks/usePets'
import { useClinicalSummary } from '../hooks/useClinicalSummary'
import { useUser } from '../hooks/useUser'
import { consultationService } from '../services/consultationService'
import { PDFService } from '../services/pdfService'
import { formatDateSafe, dateInputToISO } from '../utils/dateUtils'
import { getAnimalAvatar } from '../utils/animalUtils'
import PatientSidebar from '../components/patient/PatientSidebar'
import PatientTabs from '../components/patient/PatientTabs'
import PatientExportModal from '../components/patient/PatientExportModal'
import AddRecordForm, { type AddRecordFormRef } from '../components/patient/AddRecordForm'
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
  const { pet: patient, loading, error, refetch: refetchPatient } = usePetById(petId)
  const { summary: clinicalSummary, loading: summaryLoading, error: summaryError, refetch: refetchSummary } = useClinicalSummary(petId)
  const { user: userData } = useUser()
  const formRef = useRef<AddRecordFormRef>(null)

  const [search, setSearch] = useState('')
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null)
  const [openExport, setOpenExport] = useState(false)
  const [activeTab, setActiveTab] = useState('resumen')
  const { finalText, toggleListening, isListening, clearText } = useSpeechToText();
  const [consultation, setConsultation] = useState<Consultation | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [exportOptions, setExportOptions] = useState({
    format: 'pdf' as const,
    historia: false,
    vacunas: false,
    resumen: false,
    tratamientos: false
  })
  const [isExporting, setIsExporting] = useState(false)

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
    birthDate: formatDateSafe(patient.dateOfBirth),
    ownerPhone: patient.owners && patient.owners.length > 0 ? patient.owners[0].phone : 'Sin teléfono',
    ownerEmail: 'No disponible'
  } : undefined

  // Map consultation types from backend to UI
  const getConsultationType = (consultationType: string) => {
    const typeMap: Record<string, string> = {
      'GENERAL_CONSULTATION': 'Consulta General',
      'VACCINATION': 'Vacunación',
      'TREATMENT': 'Tratamiento',
      'CHECKUP': 'Control',
      'EMERGENCY': 'Emergencia',
      'SURGERY': 'Cirugía',
      'AESTHETIC': 'Estética',
      'REVIEW': 'Revisión'
    }
    return typeMap[consultationType] || 'Consulta General'
  }

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
      type: getConsultationType(consultation.consultationType),
      findings: consultation.findings,
      diagnosis: consultation.diagnosis,
      nextSteps: consultation.nextSteps,
      additionalNotes: consultation.additionalNotes,
      nextConsultation: consultation.nextConsultation
    })) : []


  const toggleRecordExpansion = (recordId: string) => {
    setExpandedRecordId(expandedRecordId === recordId ? null : recordId);
  };

  const handleExportClick = async () => {
    if (!id || !patient) return;

    setIsExporting(true);

    try {
      // Create a new instance for each export
      const pdfServiceInstance = new PDFService();

      pdfServiceInstance.generatePatientPDF({
        id: patient.id,
        name: patient.name,
        species: patient.species,
        breed: patient.breed,
        age: patient.age,
        owners: patient.owners || [],
        weight: patient.weight,
        sex: patient.sex === 'MALE' ? 'Macho' : patient.sex === 'FEMALE' ? 'Hembra' : 'No especificado',
        dateOfBirth: patient.dateOfBirth,
        consultations: patient.consultations,
        vaccines: patient.vaccines,
        treatments: patient.treatments,
        clinicalSummary: clinicalSummary || undefined
      }, exportOptions);

      // Close modal after successful export
      setOpenExport(false);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF. Por favor intenta de nuevo.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveRecord = async (data: any) => {
    if (!userData || !id) {
      console.error('Missing user data or pet ID')
      return
    }

    // Validate required fields
    if (!data.motivo || data.motivo.trim() === '') {
      setSubmitError('El motivo de consulta es obligatorio')
      setTimeout(() => setSubmitError(null), 5000)
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      console.log('Form data received:', data)

      // Map entry types to consultation types
      const entryTypeMap: Record<string, string> = {
        'consulta': 'Consulta General',
        'vacuna': 'Vacunación',
        'tratamiento': 'Tratamiento',
        'control': 'Control',
        'emergencia': 'Emergencia',
        'cirugia': 'Cirugía',
        'estetica': 'Estética',
        'revision': 'Revisión'
      }

      const consultationData = {
        petId: parseInt(id),
        userId: userData.id,
        consultationType: entryTypeMap[data.entryType] || 'Consulta General',
        date: data.fechaConsulta ? dateInputToISO(data.fechaConsulta) : dateInputToISO(new Date().toISOString().split('T')[0]),
        chiefComplaint: data.motivo || 'Sin especificar',
        findings: data.hallazgos,
        diagnosis: data.diagnostico,
        nextSteps: data.proximosPasos,
        additionalNotes: data.notas,
        nextConsultation: data.proximaConsulta ? dateInputToISO(data.proximaConsulta) : undefined,
        vaccines: data.vaccines?.map((vaccine: any) => ({
          catalogId: parseInt(vaccine.vaccineId),
          applicationDate: dateInputToISO(vaccine.date),
          expirationDate: vaccine.expirationDate ? dateInputToISO(vaccine.expirationDate) : undefined
        })),
        treatment: data.treatments?.map((treatment: any) => ({
          name: treatment.name,
          startDate: dateInputToISO(treatment.startDate),
          endDate: treatment.endDate ? dateInputToISO(treatment.endDate) : undefined
        }))
      }

      const result = await consultationService.createConsultation(consultationData)
      console.log('Consultation created successfully:', result)

      setSubmitSuccess(true)

      // Refetch patient data and clinical summary to show the new consultation
      refetchPatient()
      refetchSummary()

      // Reset the form for a new consultation
      formRef.current?.resetForm()

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 3000)

    } catch (error) {
      console.error('Error creating consultation:', error)
      setSubmitError(error instanceof Error ? error.message : 'Error al crear la consulta')

      // Hide error message after 5 seconds
      setTimeout(() => {
        setSubmitError(null)
      }, 5000)

    } finally {
      setIsSubmitting(false)
    }
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
                avatarUrl: getAnimalAvatar(patient.species, patient.name, patient.profileImageUrl),
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
                      <div style={{ display: 'grid', gap: '20px' }}>
                        <div style={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '20px',
                          borderLeft: '4px solid var(--brand-500)'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '12px'
                          }}>
                            <div style={{
                              backgroundColor: 'var(--brand-100)',
                              borderRadius: '8px',
                              padding: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              📋
                            </div>
                            <h3 style={{
                              margin: 0,
                              color: 'var(--brand-700)',
                              fontWeight: 600,
                              fontSize: '16px'
                            }}>
                              Información Básica
                            </h3>
                          </div>
                          <p style={{
                            margin: 0,
                            color: 'var(--text)',
                            lineHeight: '1.6',
                            whiteSpace: 'pre-line',
                            fontSize: '14px'
                          }}>
                            {clinicalSummary.basic_information}
                          </p>
                        </div>

                        <div style={{
                          backgroundColor: '#f0f9ff',
                          border: '1px solid #bae6fd',
                          borderRadius: '12px',
                          padding: '20px',
                          borderLeft: '4px solid #0ea5e9'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '12px'
                          }}>
                            <div style={{
                              backgroundColor: '#dbeafe',
                              borderRadius: '8px',
                              padding: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              📚
                            </div>
                            <h3 style={{
                              margin: 0,
                              color: '#075985',
                              fontWeight: 600,
                              fontSize: '16px'
                            }}>
                              Historial
                            </h3>
                          </div>
                          <p style={{
                            margin: 0,
                            color: 'var(--text)',
                            lineHeight: '1.6',
                            whiteSpace: 'pre-line',
                            fontSize: '14px'
                          }}>
                            {clinicalSummary.history}
                          </p>
                        </div>

                        <div style={{
                          backgroundColor: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          borderRadius: '12px',
                          padding: '20px',
                          borderLeft: '4px solid #22c55e'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '12px'
                          }}>
                            <div style={{
                              backgroundColor: '#dcfce7',
                              borderRadius: '8px',
                              padding: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              🩺
                            </div>
                            <h3 style={{
                              margin: 0,
                              color: '#15803d',
                              fontWeight: 600,
                              fontSize: '16px'
                            }}>
                              Última Consulta
                            </h3>
                          </div>
                          <p style={{
                            margin: 0,
                            color: 'var(--text)',
                            lineHeight: '1.6',
                            whiteSpace: 'pre-line',
                            fontSize: '14px'
                          }}>
                            {clinicalSummary.last_consultation}
                          </p>
                        </div>
                      </div>
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
                            {record.type === "Vacunación" ? "💉" :
                             record.type === "Tratamiento" ? "💊" :
                             record.type === "Control" ? "📋" :
                             record.type === "Emergencia" ? "🚨" :
                             record.type === "Cirugía" ? "🔪" :
                             record.type === "Estética" ? "✂️" :
                             record.type === "Revisión" ? "🔍" : "🩺"}
                          </div>
                          <div className="recordItem__body">
                            <div className="recordItem__title">{record.title}</div>
                            <div className="recordItem__meta">
                              {formatDateSafe(record.date)}
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

                              {record.nextConsultation && (
                                <div className="recordExpansion__section">
                                  <h4 className="recordExpansion__sectionTitle">📅 Próxima consulta</h4>
                                  <p className="recordExpansion__text">{formatDateSafe(record.nextConsultation)}</p>
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
                              {formatDateSafe(vaccine.applicationDate)}
                            </div>
                          </div>
                          <div className="vaccineItem__right">
                            {vaccine.expirationDate && (
                              <span className={`vaccineBadge ${
                                new Date(vaccine.expirationDate) > new Date()
                                  ? 'vaccineBadge--current'
                                  : 'vaccineBadge--expired'
                              }`}>
                                {new Date(vaccine.expirationDate) > new Date()
                                  ? 'Al día'
                                  : 'Vencida'}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tratamientos' && (
              <div className="tabContentContainer">
                <div className="tabContent">
                  <div className="recordList vacunasList">
                    {!patient.treatments || patient.treatments.length === 0 ? (
                      <div className="muted">No hay tratamientos registrados.</div>
                    ) : (
                      patient.treatments.map((treatment: any) => (
                        <div key={treatment.id} className="vaccineItem">
                          <div className="vaccineItem__icon">💊</div>
                          <div className="vaccineItem__body">
                            <div className="vaccineItem__title">{treatment.name}</div>
                            <div className="vaccineItem__meta">
                              Inicio: {formatDateSafe(treatment.startDate)}
                              {treatment.endDate && (
                                <> • Fin: {formatDateSafe(treatment.endDate)}</>
                              )}
                            </div>
                          </div>
                          <div className="vaccineItem__right">
                            {treatment.endDate ? (
                              <span className={`vaccineBadge ${
                                new Date(treatment.endDate) > new Date()
                                  ? 'vaccineBadge--current'
                                  : 'vaccineBadge--expired'
                              }`}>
                                {new Date(treatment.endDate) > new Date()
                                  ? 'En curso'
                                  : 'Finalizado'}
                              </span>
                            ) : (
                              <span className="vaccineBadge vaccineBadge--current">
                                En curso
                              </span>
                            )}
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
                    ref={formRef}
                    onSave={handleSaveRecord}
                    onVoiceInput={handleVoiceInput}
                    petId={id}
                    initialData={consultation ?? undefined}
                  />
                </div>

                {/* Status Messages */}
                {(submitSuccess || submitError) && (
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginTop: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: submitSuccess ? '#dcfce7' : '#fee2e2',
                    color: submitSuccess ? '#166534' : '#dc2626',
                    border: `1px solid ${submitSuccess ? '#bbf7d0' : '#fecaca'}`
                  }}>
                    <span>{submitSuccess ? '✅' : '❌'}</span>
                    <span>
                      {submitSuccess
                        ? 'Consulta guardada exitosamente'
                        : `Error: ${submitError}`
                      }
                    </span>
                  </div>
                )}

                <div className="formActionsExternal" style={{
                  height: '60px',
                  alignItems: 'center',
                  marginTop: submitSuccess || submitError ? '16px' : 'auto'
                }}>
                  <button
                    className={`btn ${isListening ? 'btn--danger' : 'btn--ghost'} voiceBtn`}
                    onClick={handleVoiceInput}
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: isListening ? '#ef4444' : undefined,
                      color: isListening ? 'white' : undefined
                    }}
                  >
                    {isListening ? '⏹️ Parar grabación' : '🎤 Dictar por voz'}
                  </button>
                  <button
                    className="btn btn--primary"
                    onClick={() => formRef.current?.submitForm()}
                    disabled={isSubmitting || isListening}
                  >
                    {isSubmitting ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="spinner spinner--small">
                          <div className="spinner__circle"></div>
                        </div>
                        <span>Guardando...</span>
                      </div>
                    ) : (
                      'Guardar Entrada'
                    )}
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
        onExportOptionsChange={(options) => setExportOptions({ ...exportOptions, ...options })}
        onExport={handleExportClick}
        isLoading={isExporting}
      />
    </div>
  );
}