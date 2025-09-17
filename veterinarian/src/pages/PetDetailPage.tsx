import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePatientDetail } from '../hooks/usePatientDetail'
import { usePatientExport } from '../hooks/usePatientExport'
import PatientSidebar from '../components/patient/PatientSidebar'
import PatientTabs from '../components/patient/PatientTabs'
import PatientRecordDetailModal from '../components/patient/PatientRecordDetailModal'
import PatientExportModal from '../components/patient/PatientExportModal'
import AddRecordForm from '../components/patient/AddRecordForm'
import type { PatientRecord } from '../modules/patients/types'

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [openRecordId, setOpenRecordId] = useState<string | null>(null)
  const [openExport, setOpenExport] = useState(false)
  const [activeTab, setActiveTab] = useState('historia')

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

  const selectedRecord = useMemo(() => {
    return filteredRecords.find(r => r.id === openRecordId) || null
  }, [filteredRecords, openRecordId])

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

            <div className="recordList">
              {recordsLoading && <div className="muted">Cargando…</div>}
              {!recordsLoading && filteredRecords.map((record: PatientRecord) => (
                <div key={record.id} className="recordItem" onClick={() => setOpenRecordId(record.id)}>
                  <div className="recordItem__icon">
                    {record.type === 'Vacunación' ? '💉' : record.type === 'Tratamiento' ? '🧪' : '🩺'}
                  </div>
                  <div className="recordItem__body">
                    <div className="recordItem__title">{record.title}</div>
                    <div className="recordItem__meta">
                      {new Date(record.date).toLocaleDateString()} · {record.doctor}
                    </div>
                  </div>
                  <div className="recordItem__right">
                    <span className="badge">{record.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'vacunas' && (
          <div className="tabContent">
            <div className="recordList">
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
      <PatientRecordDetailModal
        record={selectedRecord}
        onClose={() => setOpenRecordId(null)}
      />

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


