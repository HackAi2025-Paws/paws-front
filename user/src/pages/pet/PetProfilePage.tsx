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
import type { ConsultationRecord } from '../../types/index.js'
import { Syringe, Edit, Weight, Cake, Download, FileText } from 'lucide-react'

export const PetProfilePage: React.FC = () => {
  const { petId } = useParams<{ petId: string }>()
  const dispatch = useAppDispatch()
  const { selectedPet } = useAppSelector((state) => state.pets)
  const [isExporting, setIsExporting] = useState(false)
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([])
  const [vaccines, setVaccines] = useState<any[]>([])
  const [isLoadingPet, setIsLoadingPet] = useState(false)
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

  if (!selectedPet) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Mascota" showBack />
        <div className="p-4">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-gray-600">Mascota no encontrada</p>
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
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                {selectedPet.photo ? (
                  <img 
                    src={selectedPet.photo} 
                    alt={selectedPet.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="text-3xl">🐕</div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">{selectedPet.name}</h1>
                  <div className="flex gap-2">
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
                          Exportar PDF
                        </>
                      )}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                </div>
                
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-medium text-gray-700">{selectedPet.breed}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Cake className="h-4 w-4" />
                      <span>{age}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Weight className="h-4 w-4" />
                      <span>
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
                      <p className="font-medium text-green-900">{vaccine.catalog?.name || 'Vacuna'}</p>
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
                  <div key={vaccine.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{vaccine.catalog?.name || 'Vacuna'}</p>
                      <p className="text-sm text-gray-600">{vaccine.author?.name || 'Veterinario'}</p>
                      {vaccine.notes && (
                        <p className="text-xs text-gray-500 mt-1">{vaccine.notes}</p>
                      )}
                      {vaccine.batchNumber && (
                        <p className="text-xs text-gray-400">Lote: {vaccine.batchNumber}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{new Date(vaccine.applicationDate).toLocaleDateString('es-ES')}</p>
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

        {/* Registros de consultas */}
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
                  <div key={record.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{record.title}</p>
                      <p className="text-sm text-gray-600">{record.veterinarian || 'Sin veterinario'}</p>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{record.diagnosis}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{new Date(record.date).toLocaleDateString('es-ES')}</p>
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
