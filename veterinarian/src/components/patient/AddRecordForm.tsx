import { useState, useEffect } from 'react'
import { apiClient } from '../../services/apiClient'

interface AddRecordFormProps {
  onSave: (data: any) => void
  onVoiceInput: () => void
  petId: string // Required petId for backend mapping
}

type EntryType = '' | 'consulta' | 'vacuna' | 'tratamiento' | 'control' | 'emergencia' | 'cirugia' | 'estetica' | 'revision'

interface VaccineEntry {
  id: string
  vaccineId: string
  date: string
  expirationDate: string
}

interface VaccineCatalog {
  id: string
  name: string
}

interface TreatmentEntry {
  id: string
  name: string
  startDate: string
  endDate: string
}

// Backend API interfaces
interface BackendVaccine {
  catalogId: number
  applicationDate: string // ISO date string
  expirationDate?: string // ISO date string
  petId: number
}

interface BackendTreatment {
  name: string
  startDate: string // ISO date string
  endDate?: string // ISO date string
  petId: number
}

interface BackendConsultation {
  petId: number
  chiefComplaint: string
  consultationType: string
  date: string // ISO date string
  findings?: string
  diagnosis?: string
  treatment: BackendTreatment[]
  vaccines: BackendVaccine[]
  nextSteps?: string
  additionalNotes?: string
  nextConsultation?: string // ISO date string
}

export default function AddRecordForm({ onSave, onVoiceInput, petId }: AddRecordFormProps) {
  // Early validation - petId is required
  if (!petId || petId.trim() === '') {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: '#ef4444',
        backgroundColor: '#fee2e2',
        borderRadius: '8px',
        border: '1px solid #fecaca'
      }}>
        <h3>Error: ID de mascota requerido</h3>
        <p>No se puede crear una consulta sin especificar la mascota.</p>
        <p>Por favor, navega desde la lista de pacientes.</p>
      </div>
    )
  }

  const [entryType, setEntryType] = useState<EntryType>('consulta')
  const [formData, setFormData] = useState({
    motivo: '',
    hallazgos: '',
    diagnostico: '',
    tratamiento: '',
    proximosPasos: '',
    notas: '',
    fechaConsulta: new Date().toISOString().split('T')[0],
    proximaConsulta: ''
  })
  const [files, setFiles] = useState<File[]>([])
  const [vaccines, setVaccines] = useState<VaccineEntry[]>([])
  const [vaccineCatalog, setVaccineCatalog] = useState<VaccineCatalog[]>([])
  const [treatments, setTreatments] = useState<TreatmentEntry[]>([])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      const remainingSlots = 5 - files.length

      if (newFiles.length > remainingSlots) {
        alert(`Solo puedes cargar ${remainingSlots} archivo(s) más. Máximo 5 archivos por consulta.`)
        const limitedFiles = newFiles.slice(0, remainingSlots)
        setFiles([...files, ...limitedFiles])
      } else {
        setFiles([...files, ...newFiles])
      }
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  // Vaccine management functions
  const fetchVaccineCatalog = async () => {
    try {
      const response = await apiClient.get<VaccineCatalog[]>('vaccines/vaccineCatalog')
      if (response.success && response.data) {
        setVaccineCatalog(response.data)
      } else {
        console.error('Error fetching vaccine catalog:', response.error)
      }
    } catch (error) {
      console.error('Error fetching vaccine catalog:', error)
    }
  }

  const addVaccine = () => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const newVaccine: VaccineEntry = {
      id: `vaccine-${Date.now()}`,
      vaccineId: '',
      date: today,
      expirationDate: ''
    }
    setVaccines([...vaccines, newVaccine])
  }

  const removeVaccine = (id: string) => {
    setVaccines(vaccines.filter(vaccine => vaccine.id !== id))
  }

  const updateVaccine = (id: string, field: keyof Omit<VaccineEntry, 'id'>, value: string) => {
    setVaccines(vaccines.map(vaccine =>
      vaccine.id === id ? { ...vaccine, [field]: value } : vaccine
    ))
  }

  // Treatment management functions
  const addTreatment = () => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const newTreatment: TreatmentEntry = {
      id: `treatment-${Date.now()}`,
      name: '',
      startDate: today,
      endDate: ''
    }
    setTreatments([...treatments, newTreatment])
  }

  const removeTreatment = (id: string) => {
    setTreatments(treatments.filter(treatment => treatment.id !== id))
  }

  const updateTreatment = (id: string, field: keyof Omit<TreatmentEntry, 'id'>, value: string) => {
    setTreatments(treatments.map(treatment =>
      treatment.id === id ? { ...treatment, [field]: value } : treatment
    ))
  }

  // Load vaccine catalog on component mount
  useEffect(() => {
    fetchVaccineCatalog()
  }, [])

  // Map form data to backend format
  const mapToBackendFormat = (): BackendConsultation | null => {
    const petIdNumber = parseInt(petId, 10)
    if (isNaN(petIdNumber)) {
      console.error('petId must be a valid number:', petId)
      return null
    }

    // Map vaccines to backend format
    const backendVaccines: BackendVaccine[] = vaccines
      .filter(vaccine => vaccine.vaccineId && vaccine.date) // Only include complete vaccines
      .map(vaccine => ({
        catalogId: parseInt(vaccine.vaccineId, 10),
        applicationDate: vaccine.date,
        expirationDate: vaccine.expirationDate || undefined,
        petId: petIdNumber
      }))

    // Map treatments to backend format
    const backendTreatments: BackendTreatment[] = treatments
      .filter(treatment => treatment.name.trim() && treatment.startDate) // Only include complete treatments
      .map(treatment => ({
        name: treatment.name,
        startDate: treatment.startDate,
        endDate: treatment.endDate || undefined,
        petId: petIdNumber
      }))

    // Map main consultation data
    const backendConsultation: BackendConsultation = {
      petId: petIdNumber,
      chiefComplaint: formData.motivo,
      consultationType: entryType,
      date: formData.fechaConsulta,
      findings: formData.hallazgos || undefined,
      diagnosis: formData.diagnostico || undefined,
      treatment: backendTreatments,
      vaccines: backendVaccines,
      nextSteps: formData.proximosPasos || undefined,
      additionalNotes: formData.notas || undefined,
      nextConsultation: formData.proximaConsulta || undefined
    }

    return backendConsultation
  }

  const handleSave = () => {
    if (!entryType || !formData.motivo.trim()) {
      alert('Por favor completa los campos obligatorios')
      return
    }

    // Validate petId before attempting to save
    const petIdNumber = parseInt(petId, 10)
    if (isNaN(petIdNumber)) {
      alert('Error: ID de mascota inválido. No se puede guardar la consulta.')
      console.error('Invalid petId for save operation:', petId)
      return
    }

    // Create backend format data
    const backendData = mapToBackendFormat()
    if (!backendData) {
      alert('Error al preparar los datos para el servidor. Verifique la información ingresada.')
      return
    }

    // For now, pass both formats - original and backend-ready
    onSave({
      // Original format for compatibility
      type: entryType,
      ...formData,
      files,
      vaccines,
      treatments,
      // Backend-ready format
      backendFormat: backendData
    })
  }

  return (
    <div className="addRecordContainer">

      <div className="addRecordForm">
        <div className="formGroup">
          <label className="fieldLabel">Tipo de Entrada</label>
          <div className="selectWrapper">
            <select
              className="fieldSelect"
              value={entryType}
              onChange={(e) => setEntryType(e.target.value as EntryType)}
            >
              <option value="consulta">🩺 Consulta General</option>
              <option value="vacuna">💉 Vacunación</option>
              <option value="tratamiento">💊 Tratamiento</option>
              <option value="control">📋 Control</option>
              <option value="emergencia">🚨 Emergencia</option>
              <option value="cirugia">🔪 Cirugía</option>
              <option value="estetica">✂️ Estética</option>
              <option value="revision">🔍 Revisión</option>
            </select>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div className="formGroup">
            <label className="fieldLabel">Fecha de la consulta</label>
            <input
              type="date"
              className="fieldSelect"
              value={formData.fechaConsulta}
              onChange={(e) => handleInputChange('fechaConsulta', e.target.value)}
              onClick={(e) => {
                e.currentTarget.showPicker?.();
              }}
              style={{
                backgroundImage: 'none',
                paddingRight: '16px',
                cursor: 'pointer',
                width: '100%'
              }}
            />
          </div>

          <div className="formGroup">
            <label className="fieldLabel">Próxima consulta</label>
            <input
              type="date"
              className="fieldSelect"
              value={formData.proximaConsulta}
              onChange={(e) => handleInputChange('proximaConsulta', e.target.value)}
              onClick={(e) => {
                e.currentTarget.showPicker?.();
              }}
              style={{
                backgroundImage: 'none',
                paddingRight: '16px',
                cursor: 'pointer',
                width: '100%'
              }}
            />
          </div>
        </div>

        <>
            <div className="formGroup">
              <label className="fieldLabel">Motivo de consulta *</label>
              <textarea
                className="fieldTextarea"
                placeholder="Describe el motivo de la consulta..."
                value={formData.motivo}
                onChange={(e) => handleInputChange('motivo', e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="formGroup">
              <label className="fieldLabel">Hallazgos (Examen físico)</label>
              <textarea
                className="fieldTextarea"
                placeholder="Detalla los hallazgos del examen físico..."
                value={formData.hallazgos}
                onChange={(e) => handleInputChange('hallazgos', e.target.value)}
                rows={4}
              />
            </div>

            <div className="formGroup">
              <label className="fieldLabel">Diagnóstico</label>
              <textarea
                className="fieldTextarea"
                placeholder="Diagnóstico clínico..."
                value={formData.diagnostico}
                onChange={(e) => handleInputChange('diagnostico', e.target.value)}
                rows={3}
              />
            </div>

            <div className="formGroup">
              <label className="fieldLabel">Tratamiento</label>
              <textarea
                className="fieldTextarea"
                placeholder="Plan de tratamiento y medicación..."
                value={formData.tratamiento}
                onChange={(e) => handleInputChange('tratamiento', e.target.value)}
                rows={4}
              />
            </div>

            <div className="formGroup">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <label className="fieldLabel">Vacunas</label>
                <button
                  type="button"
                  onClick={addVaccine}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: 'var(--brand-600)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--brand-700)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--brand-600)'}
                >
                  + Agregar Vacuna
                </button>
              </div>

              {vaccines.map((vaccine, index) => (
                <div
                  key={vaccine.id}
                  style={{
                    backgroundColor: '#fff',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '16px',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <h4 style={{
                      margin: 0,
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'var(--text)'
                    }}>
                      Vacuna #{index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeVaccine(vaccine.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '20px',
                        cursor: 'pointer',
                        color: '#ef4444',
                        padding: '4px',
                        borderRadius: '4px',
                        lineHeight: 1
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '16px'
                  }}>
                    <div>
                      <label className="fieldLabel">Tipo de vacuna</label>
                      <div className="selectWrapper">
                        <select
                          className="fieldSelect"
                          value={vaccine.vaccineId}
                          onChange={(e) => updateVaccine(vaccine.id, 'vaccineId', e.target.value)}
                        >
                          <option value="">Seleccionar vacuna</option>
                          {vaccineCatalog.map(catalog => (
                            <option key={catalog.id} value={catalog.id}>
                              {catalog.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="fieldLabel">Fecha</label>
                      <input
                        id={`date-${vaccine.id}`}
                        type="date"
                        className="fieldSelect"
                        value={vaccine.date}
                        onChange={(e) => updateVaccine(vaccine.id, 'date', e.target.value)}
                        onClick={(e) => {
                          e.currentTarget.showPicker?.();
                        }}
                        style={{
                          backgroundImage: 'none',
                          paddingRight: '16px',
                          cursor: 'pointer',
                          width: '100%'
                        }}
                      />
                    </div>

                    <div>
                      <label className="fieldLabel">Fecha de expiración</label>
                      <input
                        id={`expiration-${vaccine.id}`}
                        type="date"
                        className="fieldSelect"
                        value={vaccine.expirationDate}
                        onChange={(e) => updateVaccine(vaccine.id, 'expirationDate', e.target.value)}
                        onClick={(e) => {
                          e.currentTarget.showPicker?.();
                        }}
                        style={{
                          backgroundImage: 'none',
                          paddingRight: '16px',
                          cursor: 'pointer',
                          width: '100%'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="formGroup">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <label className="fieldLabel">Tratamientos y Medicamentos</label>
                <button
                  type="button"
                  onClick={addTreatment}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: 'var(--brand-600)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--brand-700)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--brand-600)'}
                >
                  + Agregar Tratamiento
                </button>
              </div>

              {treatments.map((treatment, index) => (
                <div
                  key={treatment.id}
                  style={{
                    backgroundColor: '#fff',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '16px',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <h4 style={{
                      margin: 0,
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'var(--text)'
                    }}>
                      Tratamiento #{index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeTreatment(treatment.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '20px',
                        cursor: 'pointer',
                        color: '#ef4444',
                        padding: '4px',
                        borderRadius: '4px',
                        lineHeight: 1
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '16px'
                  }}>
                    <div>
                      <label className="fieldLabel">Nombre</label>
                      <input
                        type="text"
                        className="fieldSelect"
                        placeholder="Nombre del tratamiento"
                        value={treatment.name}
                        onChange={(e) => updateTreatment(treatment.id, 'name', e.target.value)}
                        style={{
                          backgroundImage: 'none',
                          paddingRight: '16px'
                        }}
                      />
                    </div>

                    <div>
                      <label className="fieldLabel">Fecha de inicio</label>
                      <input
                        id={`treatment-start-${treatment.id}`}
                        type="date"
                        className="fieldSelect"
                        value={treatment.startDate}
                        onChange={(e) => updateTreatment(treatment.id, 'startDate', e.target.value)}
                        onClick={(e) => {
                          e.currentTarget.showPicker?.();
                        }}
                        style={{
                          backgroundImage: 'none',
                          paddingRight: '16px',
                          cursor: 'pointer',
                          width: '100%'
                        }}
                      />
                    </div>

                    <div>
                      <label className="fieldLabel">Fecha de finalización</label>
                      <input
                        id={`treatment-end-${treatment.id}`}
                        type="date"
                        className="fieldSelect"
                        value={treatment.endDate}
                        onChange={(e) => updateTreatment(treatment.id, 'endDate', e.target.value)}
                        onClick={(e) => {
                          e.currentTarget.showPicker?.();
                        }}
                        style={{
                          backgroundImage: 'none',
                          paddingRight: '16px',
                          cursor: 'pointer',
                          width: '100%'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="formGroup">
              <label className="fieldLabel">Próximos pasos</label>
              <textarea
                className="fieldTextarea"
                placeholder="Seguimiento y próximas citas..."
                value={formData.proximosPasos}
                onChange={(e) => handleInputChange('proximosPasos', e.target.value)}
                rows={3}
              />
            </div>

            <div className="formGroup">
              <label className="fieldLabel">Notas adicionales</label>
              <textarea
                className="fieldTextarea"
                placeholder="Observaciones adicionales..."
                value={formData.notas}
                onChange={(e) => handleInputChange('notas', e.target.value)}
                rows={3}
              />
            </div>

            <div className="formGroup">
              <label className="fieldLabel">Archivos adjuntos ({files.length}/5)</label>
              <div className="fileUploadSection">
                <input
                  type="file"
                  id="fileUpload"
                  multiple
                  className="fileInput"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  disabled={files.length >= 5}
                />
                <label
                  htmlFor="fileUpload"
                  className={`fileUploadButton ${files.length >= 5 ? 'fileUploadButton--disabled' : ''}`}
                >
                  📎 Seleccionar archivos {files.length >= 5 ? '(Máximo alcanzado)' : ''}
                </label>

                {files.length > 0 && (
                  <div className="fileList">
                    {files.map((file, index) => (
                      <div key={index} className="fileItem">
                        <span className="fileName">{file.name}</span>
                        <button
                          type="button"
                          className="removeFileButton"
                          onClick={() => handleRemoveFile(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
      </div>
    </div>
  )
}