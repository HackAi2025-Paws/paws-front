import { useMemo, useState } from 'react'
import SearchBar from '../components/dashboard/SearchBar'
import PatientListItem from '../components/dashboard/PatientListItem'
import { usePatientsSearch, useRecentPatients } from '../modules/patients/hooks'
import mockPatientsClient from '../modules/patients/mockClient'

export default function DashboardPage() {
  const [query, setQuery] = useState('')
  const [searchFilter, setSearchFilter] = useState<'owner' | 'pet' | 'breed'>('pet')
  const client = useMemo(() => mockPatientsClient, [])
  const { results: recent, loading: loadingRecent } = useRecentPatients(client)
  const { results: searchResults, loading: loadingSearch } = usePatientsSearch(client, { query, filter: searchFilter })

  const showingSearch = query.trim().length > 0
  const list = showingSearch ? searchResults : recent
  const loading = showingSearch ? loadingSearch : loadingRecent

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="brandRow">
          <div className="brandRow__brand">VetCare Digital</div>
        </div>
        <h1 className="dashboard__title">Bienvenido, Dr. Rodríguez</h1>
        <p className="dashboard__subtitle">Consulta las historias clínicas de tus pacientes</p>
        <SearchBar
          value={query}
          onChange={setQuery}
          searchFilter={searchFilter}
          onFilterChange={setSearchFilter}
          aria-label="Buscar mascotas"
        />
      </header>

      <section className="dashboard__panel">
        <div className="panel__header">
          <div className="panel__title">
            <span className="panel__icon" aria-hidden>🩺</span>
            {showingSearch ? 'Resultados de Búsqueda' : 'Pacientes Recientes'}
          </div>
        </div>
        <div className="panel__subtitle">
          {showingSearch ? `${list.length} mascota(s) encontrada(s)` : 'Últimas mascotas con actividad médica'}
        </div>

        <div className="patientList">
          {loading && <div className="muted">Cargando…</div>}
          {!loading && list.map((p) => <PatientListItem key={p.id} patient={p} />)}
        </div>
      </section>
    </div>
  )
}


