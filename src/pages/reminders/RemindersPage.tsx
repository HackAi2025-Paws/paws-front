import React, { useState } from 'react'
import { Header } from '../../components/layout/Header'
import { ReminderList } from '../../components/features/ReminderList'
import { AddReminderForm } from '../../components/forms/AddReminderForm'
import { Button } from '../../components/ui/button'
import { Select } from '../../components/ui/select'
import { Input } from '../../components/ui/input'
import { Card, CardContent } from '../../components/ui/card'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { addReminder } from '../../store/remindersSlice'
import { Plus, Search, Filter } from 'lucide-react'
import type { Reminder } from '../../types/index.js'

export const RemindersPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { reminders } = useAppSelector((state) => state.reminders)
  const { pets } = useAppSelector((state) => state.pets)
  
  const [showCompleted, setShowCompleted] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedPetFilter, setSelectedPetFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Filtrar recordatorios
  const filteredReminders = reminders.filter(reminder => {
    const statusMatch = showCompleted ? reminder.isCompleted : !reminder.isCompleted
    const petMatch = selectedPetFilter === '' || reminder.petId === selectedPetFilter
    const searchMatch = searchQuery === '' || 
      reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reminder.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    return statusMatch && petMatch && searchMatch
  })

  const handleAddReminder = (reminderData: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = {
      ...reminderData,
      id: Date.now().toString()
    }
    dispatch(addReminder(newReminder))
    setShowAddForm(false)
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header title="Recordatorios" showBack={false} />
        
        <div className="p-4 space-y-6">
          {/* Barra de búsqueda y filtros */}
          <Card>
            <CardContent className="p-4 space-y-4">
              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar recordatorios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtros */}
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-32">
                  <Select
                    value={selectedPetFilter}
                    onChange={(e) => setSelectedPetFilter(e.target.value)}
                  >
                    <option value="">Todas las mascotas</option>
                    {pets.map(pet => (
                      <option key={pet.id} value={pet.id}>
                        {pet.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant={!showCompleted ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowCompleted(false)}
                  >
                    Pendientes
                  </Button>
                  <Button
                    variant={showCompleted ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowCompleted(true)}
                  >
                    Completados
                  </Button>
                </div>

                <Button 
                  size="sm" 
                  className="gap-2"
                  onClick={() => setShowAddForm(true)}
                >
                  <Plus className="h-4 w-4" />
                  Nuevo
                </Button>
              </div>

              {/* Contador de resultados */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  {filteredReminders.length} recordatorio{filteredReminders.length !== 1 ? 's' : ''} 
                  {selectedPetFilter && (
                    <span> de {pets.find(p => p.id === selectedPetFilter)?.name}</span>
                  )}
                </span>
                
                {(selectedPetFilter || searchQuery) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedPetFilter('')
                      setSearchQuery('')
                    }}
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lista de recordatorios */}
          <div>
            <ReminderList 
              reminders={filteredReminders}
              showCompleted={showCompleted}
            />
          </div>

          {/* Mensaje cuando no hay recordatorios */}
          {filteredReminders.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                {searchQuery || selectedPetFilter ? (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No se encontraron recordatorios
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Intenta cambiar los filtros o crear un nuevo recordatorio
                    </p>
                  </>
                ) : showCompleted ? (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No hay recordatorios completados
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Los recordatorios completados aparecerán aquí
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      ¡Todo al día!
                    </h3>
                    <p className="text-gray-600 mb-4">
                      No tienes recordatorios pendientes
                    </p>
                  </>
                )}
                
                <Button 
                  className="gap-2"
                  onClick={() => setShowAddForm(true)}
                >
                  <Plus className="h-4 w-4" />
                  Agregar Recordatorio
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal del formulario */}
      {showAddForm && (
        <AddReminderForm
          pets={pets}
          onSubmit={handleAddReminder}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </>
  )
}
