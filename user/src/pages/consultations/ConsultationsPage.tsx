import React, { useState, useEffect } from 'react'
import { Header } from '../../components/layout/Header'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { Badge } from '../../components/ui/badge'
import { AddConsultationForm } from '../../components/forms/AddConsultationForm'
import { AddVaccineForm } from '../../components/forms/AddVaccineForm'
import { AddTreatmentForm } from '../../components/forms/AddTreatmentForm'
import { useAppSelector } from '../../hooks'
// import { addConsultationRecord } from '../../store/petsSlice'
import { petService } from '../../services/petService'
import type { ConsultationRecord, VaccinationFormData, TreatmentFormData } from '../../types'

// Tipo extendido para incluir información de la mascota
type ConsultationWithPetInfo = ConsultationRecord & {
  petName: string
  petBreed: string
}
import { 
  Plus, 
  Search, 
  Calendar,
  Stethoscope,
  FileText,
  DollarSign,
  MapPin,
  User,
  ChevronDown,
  ChevronUp,
  Filter,
  Syringe,
  Pill
} from 'lucide-react'

export const ConsultationsPage: React.FC = () => {
  // const dispatch = useAppDispatch()
  const { pets } = useAppSelector((state) => state.pets)
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [showVaccineForm, setShowVaccineForm] = useState(false)
  const [showTreatmentForm, setShowTreatmentForm] = useState(false)
  const [selectedPetFilter, setSelectedPetFilter] = useState('')
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedRecords, setExpandedRecords] = useState<Set<string>>(new Set())
  const [consultations, setConsultations] = useState<ConsultationWithPetInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Cargar consultas desde el backend cuando se monta el componente
  useEffect(() => {
    const loadConsultations = async () => {
      setIsLoading(true)
      try {
        console.log('📥 Loading consultations from backend...')
        
        // Obtener todas las consultas del usuario (sin filtro de petId)
        const allConsultations = await petService.getConsultations()
        
        // Agregar información de la mascota a cada consulta
        const consultationsWithPetInfo = allConsultations.map(consultation => {
          const pet = pets.find(p => p.id === consultation.petId)
          return {
            ...consultation,
            petName: pet?.name || 'Mascota desconocida',
            petBreed: pet?.breed || 'Raza desconocida'
          }
        })
        
        setConsultations(consultationsWithPetInfo)
        console.log('✅ Consultations loaded successfully:', consultationsWithPetInfo)
      } catch (error) {
        console.error('❌ Error loading consultations:', error)
        // Fallback a datos vacíos en lugar de mock
        setConsultations([])
      } finally {
        setIsLoading(false)
      }
    }

    loadConsultations()
  }, [pets]) // Volver a cargar si cambian las mascotas

  // Usar consultations en lugar de pet.consultationRecords
  const allConsultationRecords = consultations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Filtrar registros
  const filteredRecords = allConsultationRecords.filter(record => {
    const matchesPet = selectedPetFilter === '' || record.petId === selectedPetFilter
    const matchesType = selectedTypeFilter === '' || record.type === selectedTypeFilter
    const matchesSearch = searchQuery === '' || 
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.veterinarian?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.clinicName?.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesPet && matchesType && matchesSearch
  })

  const consultationTypes = [
    { value: 'consulta', label: 'Consulta General', icon: '🩺', color: 'bg-blue-100 text-blue-800' },
    { value: 'vacunacion', label: 'Vacunación', icon: '💉', color: 'bg-green-100 text-green-800' },
    { value: 'tratamiento', label: 'Tratamiento', icon: '💊', color: 'bg-purple-100 text-purple-800' },
    { value: 'control', label: 'Control', icon: '📋', color: 'bg-orange-100 text-orange-800' },
    { value: 'emergencia', label: 'Emergencia', icon: '🚨', color: 'bg-red-100 text-red-800' },
    { value: 'cirugia', label: 'Cirugía', icon: '⚕️', color: 'bg-red-100 text-red-800' },
    { value: 'estetica', label: 'Estética', icon: '✂️', color: 'bg-pink-100 text-pink-800' },
    { value: 'revision', label: 'Revisión', icon: '🔍', color: 'bg-gray-100 text-gray-800' }
  ]

  const getTypeInfo = (type: ConsultationRecord['type']) => {
    return consultationTypes.find(t => t.value === type) || consultationTypes[0]
  }

  const handleAddConsultation = async (consultationData: Omit<ConsultationRecord, 'id' | 'createdAt'>, vaccinations?: VaccinationFormData[], treatments?: TreatmentFormData[]) => {
    try {
      console.log('🔄 Creating consultation with vaccines and treatments...')
      console.log('📋 Consultation data:', consultationData)
      console.log('💉 Vaccinations:', vaccinations)
      console.log('💊 Treatments:', treatments)
      
      // Llamar al backend con el nuevo método
      const newRecord = await petService.createConsultationWithVaccinesAndTreatments(consultationData, vaccinations, treatments)
      
      // Agregar a la lista local con información de mascota
      const pet = pets.find(p => p.id === newRecord.petId)
      const newRecordWithPetInfo = {
        ...newRecord,
        petName: pet?.name || 'Mascota desconocida',
        petBreed: pet?.breed || 'Raza desconocida'
      }
      
      setConsultations(prev => [newRecordWithPetInfo, ...prev])
      setShowAddForm(false)
      
      console.log('✅ Consultation created successfully:', newRecord)
    } catch (error) {
      console.error('❌ Error creating consultation:', error)
      alert('Error al crear la consulta. Por favor, inténtalo de nuevo.')
    }
  }

  const toggleExpanded = (recordId: string) => {
    const newExpanded = new Set(expandedRecords)
    if (newExpanded.has(recordId)) {
      newExpanded.delete(recordId)
    } else {
      newExpanded.add(recordId)
    }
    setExpandedRecords(newExpanded)
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header title="Historial de Consultas" showBack={false} />
        
        <div className="p-4 space-y-6">
          {/* Botón agregar consulta */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Registros Médicos
              </h2>
              <p className="text-sm text-gray-600">
                {filteredRecords.length} registro{filteredRecords.length !== 1 ? 's' : ''} encontrado{filteredRecords.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nueva Consulta
              </Button>
              <Button 
                onClick={() => setShowVaccineForm(true)} 
                className="flex items-center gap-2"
                variant="outline"
              >
                <Syringe className="h-4 w-4" />
                Nueva Vacuna
              </Button>
              <Button 
                onClick={() => setShowTreatmentForm(true)} 
                className="flex items-center gap-2"
                variant="outline"
              >
                <Pill className="h-4 w-4" />
                Nuevo Tratamiento
              </Button>
            </div>
          </div>

          {/* Filtros y búsqueda */}
          <Card>
            <CardContent className="p-4 space-y-4">
              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar en diagnósticos, títulos, veterinario..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Filter className="h-4 w-4 inline mr-1" />
                    Filtrar por mascota
                  </label>
                  <Select
                    value={selectedPetFilter}
                    onChange={(e) => setSelectedPetFilter(e.target.value)}
                  >
                    <option value="">Todas las mascotas</option>
                    {pets.map(pet => (
                      <option key={pet.id} value={pet.id}>
                        {pet.name} ({pet.breed})
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filtrar por tipo
                  </label>
                  <Select
                    value={selectedTypeFilter}
                    onChange={(e) => setSelectedTypeFilter(e.target.value)}
                  >
                    <option value="">Todos los tipos</option>
                    {consultationTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Botón limpiar filtros */}
              {(selectedPetFilter || selectedTypeFilter || searchQuery) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedPetFilter('')
                    setSelectedTypeFilter('')
                    setSearchQuery('')
                  }}
                  className="w-full"
                >
                  Limpiar filtros
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Lista de consultas */}
          {isLoading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Cargando consultas...</p>
              </CardContent>
            </Card>
          ) : filteredRecords.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {allConsultationRecords.length === 0 
                    ? 'No hay consultas registradas'
                    : 'No se encontraron resultados'
                  }
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  {allConsultationRecords.length === 0 
                    ? 'Comienza registrando tu primera consulta veterinaria'
                    : 'Intenta con otros términos de búsqueda o ajusta los filtros'
                  }
                </p>
                {allConsultationRecords.length === 0 && (
                  <Button onClick={() => setShowAddForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Registrar Primera Consulta
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((record) => {
                const typeInfo = getTypeInfo(record.type)
                const isExpanded = expandedRecords.has(record.id)
                
                return (
                  <Card key={record.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <button
                        onClick={() => toggleExpanded(record.id)}
                        className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            {/* Encabezado */}
                            <div className="flex items-start gap-3">
                              <div className="text-2xl">{typeInfo.icon}</div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">
                                  {record.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {record.petName} • {new Date(record.date).toLocaleDateString('es-ES')}
                                </p>
                              </div>
                            </div>

                            {/* Badges y info básica */}
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className={typeInfo.color}>
                                {typeInfo.label}
                              </Badge>
                              {record.veterinarian && (
                                <Badge variant="outline" className="bg-gray-100 text-gray-700">
                                  <User className="h-3 w-3 mr-1" />
                                  {record.veterinarian}
                                </Badge>
                              )}
                              {record.cost && (
                                <Badge variant="outline" className="bg-green-100 text-green-700">
                                  <DollarSign className="h-3 w-3 mr-1" />
                                  ${record.cost}
                                </Badge>
                              )}
                            </div>

                            {/* Diagnóstico preview */}
                            <p className="text-sm text-gray-700 line-clamp-2">
                              <strong>Diagnóstico:</strong> {record.diagnosis}
                            </p>
                          </div>
                          
                          <div className="flex-shrink-0 ml-3">
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </button>
                      
                      {/* Contenido expandido */}
                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-gray-100">
                          <div className="pt-4 space-y-4">
                            {/* Información completa */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              {record.clinicName && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-gray-400" />
                                  <span><strong>Clínica:</strong> {record.clinicName}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span><strong>Fecha:</strong> {new Date(record.date).toLocaleDateString('es-ES')}</span>
                              </div>
                            </div>

                            {/* Diagnóstico completo */}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                <Stethoscope className="h-4 w-4" />
                                Diagnóstico
                              </h4>
                              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                                {record.diagnosis}
                              </p>
                            </div>

                            {/* Prescripción */}
                            {record.prescription && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  Prescripción/Tratamiento
                                </h4>
                                <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
                                  {record.prescription}
                                </p>
                              </div>
                            )}

                            {/* Notas */}
                            {record.notes && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Notas</h4>
                                <p className="text-gray-600 italic">
                                  {record.notes}
                                </p>
                              </div>
                            )}

                            {/* Próxima cita */}
                            {record.nextAppointment && (
                              <div className="bg-orange-50 p-3 rounded-lg">
                                <p className="text-orange-800 font-medium">
                                  <Calendar className="h-4 w-4 inline mr-1" />
                                  Próxima cita: {new Date(record.nextAppointment).toLocaleDateString('es-ES')}
                                </p>
                              </div>
                            )}

                            {/* Metadatos */}
                            <div className="pt-2 border-t border-gray-100">
                              <p className="text-xs text-gray-500">
                                Registrado el {new Date(record.createdAt).toLocaleDateString('es-ES')} a las{' '}
                                {new Date(record.createdAt).toLocaleTimeString('es-ES')}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal del formulario de consulta */}
      {showAddForm && (
        <AddConsultationForm
          onSubmit={handleAddConsultation}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {/* Modal del formulario de vacuna */}
      {showVaccineForm && (
        <AddVaccineForm
          onSubmit={handleAddConsultation}
          onClose={() => setShowVaccineForm(false)}
        />
      )}

      {/* Modal del formulario de tratamiento */}
      {showTreatmentForm && (
        <AddTreatmentForm
          onSubmit={handleAddConsultation}
          onClose={() => setShowTreatmentForm(false)}
        />
      )}
    </>
  )
}
