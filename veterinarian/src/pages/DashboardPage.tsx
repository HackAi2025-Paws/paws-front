import { useState } from 'react'
import SearchBar from '../components/dashboard/SearchBar'
import PatientListItem from '../components/dashboard/PatientListItem'
import Pagination from '../components/dashboard/Pagination'
import { usePetsSearch, useDefaultPets } from '../hooks/usePets'
import { useAuth } from '../modules/auth/AuthContext'


export default function DashboardPage() {
  const [query, setQuery] = useState('')
  const [searchFilter, setSearchFilter] = useState<'name' | 'ownerName' | 'breed'>('name')
  const [currentPage, setCurrentPage] = useState(1)
  const { user, logout } = useAuth()


  const showingSearch = query.trim().length > 0

  // Load default pets (first 5 without filters) or search pets
  const { pets: defaultPets, loading: loadingDefault, error: errorDefault } = useDefaultPets(5)
  const { pets: searchPets, loading: loadingSearch, error: errorSearch, pagination } = usePetsSearch(
    showingSearch ? { [searchFilter]: query, limit: 5, page: currentPage } : {}
  )


  // Use search results when searching, default pets otherwise
  const realPets = showingSearch ? searchPets : defaultPets
  const loading = showingSearch ? loadingSearch : loadingDefault
  const error = showingSearch ? errorSearch : errorDefault


  // Use only real pets from API, ensure it's always an array
  const allPets = realPets || []


  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery)
    setCurrentPage(1) // Reset to first page when searching
  }


  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="brandRow" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className="brandRow__brand">VetCare Digital</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {user && (
              <span style={{ fontSize: '14px', color: 'var(--muted)' }}>
                 {user.firstName} {user.lastName}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="btn btn--secondary"
              style={{ fontSize: '14px', padding: '8px 16px' }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
        <h1 className="dashboard__title">
          Bienvenido{user ? `, Dr. ${user.lastName}` : ', Doctor'}
        </h1>
        <p className="dashboard__subtitle">Consulta las historias clínicas de tus pacientes</p>
        <SearchBar
          value={query}
          onChange={handleSearch}
          searchFilter={searchFilter}
          onFilterChange={setSearchFilter}
          aria-label="Buscar mascotas"
        />
      </header>

      <section className="dashboard__panel">
        <div className="panel__header">
          <div className="panel__title">
            <span className="panel__icon" aria-hidden>🩺</span>
            {showingSearch ? 'Resultados de Búsqueda' : 'Pacientes'}
          </div>
        </div>
        <div className="panel__subtitle">
          {showingSearch ? `${allPets.length} mascota(s) encontrada(s)` : ''}
        </div>

        <div className="patientList">
          {loading && <div className="muted">Cargando…</div>}
          {error && <div className="muted">Error: {error}</div>}
          {!loading && !error && Array.isArray(allPets) && allPets.map((pet) => (
            <PatientListItem key={pet.id} pet={pet} />
          ))}
          {!loading && !error && (!Array.isArray(allPets) || allPets.length === 0) && (
            <div className="muted">No se encontraron mascotas</div>
          )}
        </div>

        {showingSearch && pagination && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.pages}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
            onPageChange={handlePageChange}
          />
        )}
      </section>
    </div>
  )
}


