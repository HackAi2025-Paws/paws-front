import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Header } from '../../components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { setSelectedPet } from '../../store/petsSlice'
import { calculateAge, formatDate } from '../../lib/utils'
import { exportPetHistoryToPDF } from '../../lib/pdfExport'
import { Calendar, Syringe, Stethoscope, Edit, Weight, Cake, Download, FileText } from 'lucide-react'

export const PetProfilePage: React.FC = () => {
  const { petId } = useParams<{ petId: string }>()
  const dispatch = useAppDispatch()
  const { pets, selectedPet } = useAppSelector((state) => state.pets)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    if (petId) {
      const pet = pets.find(p => p.id === petId)
      dispatch(setSelectedPet(pet || null))
    }
  }, [petId, pets, dispatch])

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
  const upcomingAppointments = selectedPet.appointments.filter(
    apt => apt.status === 'programada'
  )
  const upcomingVaccinations = selectedPet.vaccinations.filter(
    vacc => vacc.nextDue && new Date(vacc.nextDue) > new Date()
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
                      <span>{selectedPet.weight.min}-{selectedPet.weight.max} {selectedPet.weight.unit}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximos eventos */}
        {(upcomingAppointments.length > 0 || upcomingVaccinations.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Próximos Eventos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingAppointments.map(apt => (
                <div key={apt.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Stethoscope className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="font-medium text-blue-900 capitalize">{apt.type}</p>
                      <p className="text-sm text-blue-700">{apt.veterinarian}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{formatDate(apt.date)}</Badge>
                </div>
              ))}
              
              {upcomingVaccinations.map(vacc => (
                <div key={vacc.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Syringe className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="font-medium text-green-900">{vacc.name}</p>
                      <p className="text-sm text-green-700">Vacuna pendiente</p>
                    </div>
                  </div>
                  <Badge variant="outline">{formatDate(vacc.nextDue!)}</Badge>
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
            {selectedPet.vaccinations.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No hay vacunas registradas</p>
            ) : (
              <div className="space-y-3">
                {selectedPet.vaccinations.map(vacc => (
                  <div key={vacc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{vacc.name}</p>
                      <p className="text-sm text-gray-600">{vacc.veterinarian}</p>
                      {vacc.notes && (
                        <p className="text-xs text-gray-500 mt-1">{vacc.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{formatDate(vacc.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Historial de consultas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Stethoscope className="h-5 w-5 mr-2" />
              Historial de Consultas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPet.appointments.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No hay consultas registradas</p>
            ) : (
              <div className="space-y-3">
                {selectedPet.appointments.map(apt => (
                  <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium capitalize">{apt.type}</p>
                      <p className="text-sm text-gray-600">{apt.veterinarian}</p>
                      {apt.notes && (
                        <p className="text-xs text-gray-500 mt-1">{apt.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={apt.status === 'completada' ? 'default' : 'outline'}
                      >
                        {apt.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(apt.date)}
                      </p>
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
            {selectedPet.consultationRecords.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No hay consultas registradas</p>
            ) : (
              <div className="space-y-3">
                {selectedPet.consultationRecords.slice(0, 3).map(record => (
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
                {selectedPet.consultationRecords.length > 3 && (
                  <p className="text-sm text-gray-500 text-center">
                    Y {selectedPet.consultationRecords.length - 3} consulta{selectedPet.consultationRecords.length - 3 !== 1 ? 's' : ''} más...
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
