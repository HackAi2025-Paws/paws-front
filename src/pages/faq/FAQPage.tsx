import React, { useState } from 'react'
import { Header } from '../../components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { mockFAQs } from '../../data/mockData'
import type { FAQ } from '../../types/index.js'
import { Search, ChevronDown, ChevronUp, Heart, Utensils, Brain, Shield, AlertTriangle } from 'lucide-react'

const categoryIcons = {
  alimentacion: Utensils,
  salud: Heart,
  comportamiento: Brain,
  cuidados: Shield,
  emergencias: AlertTriangle,
}

const categoryColors = {
  alimentacion: 'bg-green-100 text-green-800',
  salud: 'bg-red-100 text-red-800',
  comportamiento: 'bg-blue-100 text-blue-800',
  cuidados: 'bg-purple-100 text-purple-800',
  emergencias: 'bg-orange-100 text-orange-800',
}

export const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<FAQ['category'] | 'all'>('all')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const categories = ['all', 'alimentacion', 'salud', 'comportamiento', 'cuidados', 'emergencias'] as const

  const filteredFAQs = mockFAQs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Preguntas Frecuentes" showBack={false} />
      
      <div className="p-4 space-y-6">
        {/* Buscador */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar pregunta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Filtros por categoría */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Categorías</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isSelected = selectedCategory === category
              const Icon = category !== 'all' ? categoryIcons[category as keyof typeof categoryIcons] : null
              
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors
                    ${isSelected 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }
                  `}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {category === 'all' ? 'Todas' : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              )
            })}
          </div>
        </div>

        {/* Resultados */}
        <div>
          <p className="text-sm text-gray-600 mb-4">
            {filteredFAQs.length} pregunta{filteredFAQs.length !== 1 ? 's' : ''} encontrada{filteredFAQs.length !== 1 ? 's' : ''}
          </p>

          {filteredFAQs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron resultados
                </h3>
                <p className="text-gray-600 text-center">
                  Intenta con otros términos de búsqueda o selecciona una categoría diferente
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredFAQs.map((faq) => {
                const isExpanded = expandedItems.has(faq.id)
                const Icon = categoryIcons[faq.category]
                
                return (
                  <Card key={faq.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <button
                        onClick={() => toggleExpanded(faq.id)}
                        className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start gap-2">
                              <Icon className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <h3 className="font-medium text-gray-900 pr-2">
                                {faq.question}
                              </h3>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={categoryColors[faq.category]}
                            >
                              {faq.category.charAt(0).toUpperCase() + faq.category.slice(1)}
                            </Badge>
                          </div>
                          
                          <div className="flex-shrink-0 ml-2">
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </button>
                      
                      {isExpanded && (
                        <div className="px-4 pb-4">
                          <div className="pl-6 pt-2 border-t border-gray-100">
                            <p className="text-gray-700 leading-relaxed">
                              {faq.answer}
                            </p>
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

        {/* Sección de ayuda adicional */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">¿No encontraste lo que buscabas?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800 mb-4">
              Nuestro equipo veterinario está disponible para resolver tus dudas específicas.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Chat con Veterinario
              </button>
              <button className="flex-1 bg-white text-blue-600 py-2 px-4 rounded-lg font-medium border border-blue-200 hover:bg-blue-50 transition-colors">
                Programar Consulta
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
