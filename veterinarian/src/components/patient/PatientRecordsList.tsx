import type { PatientRecord } from '../../modules/patients/types'

interface PatientRecordsListProps {
  records: PatientRecord[]
  loading: boolean
  search: string
  onSearchChange: (search: string) => void
  onRecordClick: (recordId: string) => void
}

export default function PatientRecordsList({
  records,
  loading,
  search,
  onSearchChange,
  onRecordClick
}: PatientRecordsListProps) {
  const getRecordIcon = (type: PatientRecord['type']) => {
    switch (type) {
      case 'Vacunación': return '💉'
      case 'Tratamiento': return '🧪'
      default: return '🩺'
    }
  }

  return (
    <>
      <div className="search">
        <span className="search__icon" aria-hidden>🔎</span>
        <input
          className="search__input"
          placeholder="Buscar en historial clínico..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="recordList">
        {loading && <div className="muted">Cargando…</div>}
        {!loading && records.map((record) => (
          <div key={record.id} className="recordItem">
            <div className="recordItem__icon">{getRecordIcon(record.type)}</div>
            <div className="recordItem__body">
              <div className="recordItem__title">{record.title}</div>
              <div className="recordItem__meta">
                {new Date(record.date).toLocaleDateString()} · {record.doctor}
              </div>
            </div>
            <div className="recordItem__right">
              <span className="badge">{record.type}</span>
              <button className="linkButton" onClick={() => onRecordClick(record.id)}>
                Ver más
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}