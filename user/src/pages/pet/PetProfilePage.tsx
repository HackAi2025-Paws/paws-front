import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Header } from '../../components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { setSelectedPet } from '../../store/petsSlice'
import { calculateAge } from '../../lib/utils'
import { exportPetHistoryToPDF } from '../../lib/pdfExport'
import { petService } from '../../services/petService'
import type { ConsultationRecord, Vaccination, Treatment } from '../../types'
import { Syringe, Weight, Cake, Download, FileText, Pill } from 'lucide-react'

export const PetProfilePage: React.FC = () => {
  const { petId } = useParams<{ petId: string }>()
  const dispatch = useAppDispatch()
  const { selectedPet } = useAppSelector((state) => state.pets)
  const [isExporting, setIsExporting] = useState(false)
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([])
  const [vaccines, setVaccines] = useState<Vaccination[]>([])
  const [treatments, setTreatments] = useState<Treatment[]>([])
  const [isLoadingPet, setIsLoadingPet] = useState(false)
  const [isLoadingTreatments, setIsLoadingTreatments] = useState(true)
  const [isLoadingVaccines, setIsLoadingVaccines] = useState(false)

  // Cargar información completa de la mascota desde backend (GET /pets)
  useEffect(() => {
    const loadPetFromBackend = async () => {
      if (!petId) return
      
      setIsLoadingPet(true)
      try {
        console.log('📥 Loading complete pet data from backend:', petId)
        
        // Obtener información completa de la mascota incluyendo historial clínico
        const petData = await petService.getPetById(petId)
        
        // Setear la mascota en el store Redux
        dispatch(setSelectedPet(petData))
        
        // Setear las consultas desde los datos de la mascota
        setConsultations(petData.consultationRecords || [])
        
        console.log('✅ Complete pet data loaded:', petData)
        console.log('📋 Pet consultations:', petData.consultationRecords)
      } catch (error) {
        console.error('❌ Error loading pet from backend:', error)
        // Fallback: limpiar datos
        dispatch(setSelectedPet(null))
        setConsultations([])
      } finally {
        setIsLoadingPet(false)
      }
    }

    loadPetFromBackend()
  }, [petId, dispatch])

  // Cargar vacunas específicas de esta mascota desde endpoint /vaccines
  useEffect(() => {
    const loadPetVaccines = async () => {
      if (!petId) return
      
      setIsLoadingVaccines(true)
      try {
        console.log('📥 Loading vaccines for pet:', petId)
        
        // Obtener vacunas específicas de la mascota
        const petVaccines = await petService.getPetVaccines(petId)
        setVaccines(petVaccines)
        
        console.log('✅ Pet vaccines loaded:', petVaccines)
      } catch (error) {
        console.error('❌ Error loading pet vaccines:', error)
        setVaccines([])
      } finally {
        setIsLoadingVaccines(false)
      }
    }

    loadPetVaccines()
  }, [petId])

  // Cargar tratamientos específicos de esta mascota desde endpoint /treatment
  useEffect(() => {
    const loadPetTreatments = async () => {
      if (!petId) return
      
      setIsLoadingTreatments(true)
      try {
        console.log('📥 Loading treatments for pet:', petId)
        
        // Obtener tratamientos específicos de la mascota
        const petTreatments = await petService.getPetTreatments(petId)
        setTreatments(petTreatments)
        
        console.log('✅ Pet treatments loaded:', petTreatments)
      } catch (error) {
        console.error('❌ Error loading pet treatments:', error)
        setTreatments([])
      } finally {
        setIsLoadingTreatments(false)
      }
    }

    loadPetTreatments()
  }, [petId])

  if (!selectedPet) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Mascota" showBack />
        <div className="p-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              {isLoadingPet ? (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mb-4"></div>
                  <p className="text-gray-600">Cargando mascota...</p>
                </>
              ) : (
                <p className="text-gray-600">Mascota no encontrada</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const age = calculateAge(selectedPet.birthDate)
  const upcomingVaccinations = vaccines.filter(
    vaccine => vaccine.expirationDate && new Date(vaccine.expirationDate) > new Date()
  )

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      await exportPetHistoryToPDF(selectedPet)
    } catch (error) {
      console.error('Error al exportar PDF:', error)
      alert('Hubo un error al generar el PDF. Por favor, intenta de nuevo.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={selectedPet.name} showBack />
      
      <div className="p-4 space-y-6">
        {/* Información básica */}
        <Card className="relative">
          {/* Botón Exportar PDF en esquina superior derecha */}
          <div className="absolute top-4 right-4 z-10">
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Generando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </>
              )}
            </Button>
          </div>

          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto sm:mx-0">
                {selectedPet.photo ? (
                  <img 
                    src={selectedPet.photo} 
                    alt={selectedPet.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="text-2xl sm:text-3xl">🐕</div>
                )}
              </div>
              
              <div className="flex-1 w-full text-center sm:text-left">
                <div className="flex flex-col space-y-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedPet.name}</h1>
                </div>
                
                <div className="mt-3">
                  {/* Raza */}
                  <div className="text-center sm:text-left mb-3">
                    <span className="text-base sm:text-lg font-medium text-gray-700">{selectedPet.breed}</span>
                  </div>
                  
                  {/* Grid de información en cards pequeñas */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
                        <Cake className="h-4 w-4" />
                        <span className="text-xs font-medium">Edad</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{age}</span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
                        <Weight className="h-4 w-4" />
                        <span className="text-xs font-medium">Peso</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {selectedPet.weight && selectedPet.weight.min > 0 
                          ? `${selectedPet.weight.min}-${selectedPet.weight.max} ${selectedPet.weight.unit}`
                          : 'No registrado'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximas vacunas a vencer */}
        {upcomingVaccinations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Syringe className="h-5 w-5 mr-2" />
                Próximas Vacunas a Vencer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingVaccinations.map(vaccine => (
                <div key={vaccine.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Syringe className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="font-medium text-green-900">
                        {(() => {
                          // Extraer el tipo real de vacuna del notes si existe
                          const notes = vaccine.notes || ''
                          const vaccineTypeMatch = notes.match(/^([^-]+)/)
                          const extractedType = vaccineTypeMatch ? vaccineTypeMatch[1].trim() : null
                          
                          // Si el tipo extraído es diferente al catálogo, usar el tipo extraído
                          const catalogName = vaccine.vaccine?.name || vaccine.catalog?.name || 'Vacuna'
                          
                          return extractedType && extractedType !== catalogName ? extractedType : catalogName
                        })()}
                      </p>
                      <p className="text-sm text-green-700">Próxima a vencer</p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {new Date(vaccine.expirationDate!).toLocaleDateString('es-ES')}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Layout en Grid para Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Historial de vacunas */}
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Syringe className="h-5 w-5 mr-2" />
              Historial de Vacunas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingVaccines ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : vaccines.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No hay vacunas registradas</p>
            ) : (
              <div className="space-y-3">
                {vaccines.map(vaccine => (
                  <div key={vaccine.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg space-y-2 sm:space-y-0">
                    <div className="flex-1">
                      <p className="font-medium">
                        {(() => {
                          // Extraer el tipo real de vacuna del notes si existe
                          const notes = vaccine.notes || ''
                          const vaccineTypeMatch = notes.match(/^([^-]+)/)
                          const extractedType = vaccineTypeMatch ? vaccineTypeMatch[1].trim() : null
                          
                          // Si el tipo extraído es diferente al catálogo, usar el tipo extraído
                          const catalogName = vaccine.vaccine?.name || vaccine.catalog?.name || 'Vacuna'
                          
                          return extractedType && extractedType !== catalogName ? extractedType : catalogName
                        })()}
                      </p>
                      <p className="text-sm text-gray-600">{vaccine.author?.name || 'Veterinario'}</p>
                      {vaccine.notes && (
                        <p className="text-xs text-gray-500 mt-1">{vaccine.notes}</p>
                      )}
                      {vaccine.batchNumber && (
                        <p className="text-xs text-gray-400">Lote: {vaccine.batchNumber}</p>
                      )}
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-medium">{vaccine.applicationDate ? new Date(vaccine.applicationDate).toLocaleDateString('es-ES') : 'Fecha no disponible'}</p>
                      {vaccine.expirationDate && (
                        <p className="text-xs text-gray-500">
                          Vence: {new Date(vaccine.expirationDate).toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Historial de tratamientos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Pill className="h-5 w-5 mr-2" />
              Historial de Tratamientos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingTreatments ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : treatments.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No hay tratamientos registrados</p>
            ) : (
              <div className="space-y-3">
                {treatments.map((treatment, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {treatment.name || 'Tratamiento'}
                        </h4>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          {treatment.startDate && (
                            <p>
                              <span className="font-medium">Inicio:</span> {' '}
                              {new Date(treatment.startDate).toLocaleDateString('es-ES')}
                            </p>
                          )}
                          {treatment.endDate && (
                            <p>
                              <span className="font-medium">Fin:</span> {' '}
                              {new Date(treatment.endDate).toLocaleDateString('es-ES')}
                            </p>
                          )}
                          {treatment.dosage && (
                            <p>
                              <span className="font-medium">Dosis:</span> {treatment.dosage}
                            </p>
                          )}
                          {treatment.instructions && (
                            <p>
                              <span className="font-medium">Instrucciones:</span> {treatment.instructions}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="sm:ml-4 text-left sm:text-right">
                        {treatment.endDate ? (
                          new Date(treatment.endDate) > new Date() ? (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Activo
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-600 border-gray-600">
                              Finalizado
                            </Badge>
                          )
                        ) : (
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            En curso
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        </div>

        {/* Registros de consultas - Full Width */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Historial de Consultas
              </span>
              <Link to="/consultations">
                <Button variant="outline" size="sm">
                  Ver Todo
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingPet ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : consultations.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No hay consultas registradas</p>
            ) : (
              <div className="space-y-3">
                {consultations.slice(0, 3).map(record => (
                  <div key={record.id} className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-3 border rounded-lg space-y-2 sm:space-y-0">
                    <div className="flex-1">
                      <p className="font-medium">{record.title}</p>
                      <p className="text-sm text-gray-600">{record.veterinarian || 'Sin veterinario'}</p>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{record.diagnosis}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-medium">{new Date(record.date).toLocaleDateString('es-ES')}</p>
                      {record.cost && (
                        <p className="text-xs text-green-600">${record.cost}</p>
                      )}
                    </div>
                  </div>
                ))}
                {consultations.length > 3 && (
                  <p className="text-sm text-gray-500 text-center">
                    Y {consultations.length - 3} consulta{consultations.length - 3 !== 1 ? 's' : ''} más...
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notas */}
        {selectedPet.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{selectedPet.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
