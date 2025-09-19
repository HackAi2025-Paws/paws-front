import React from 'react'
import { Header } from '../../components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { useAppSelector } from '../../hooks'

export const ProfilePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Perfil" showBack={false} />
        <div className="p-4">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-gray-600">Usuario no encontrado</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Mi Perfil" showBack={false} />
      
      <div className="p-4 space-y-6">
        {/* Información del usuario */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </CardContent>
        </Card>


        {/* Sección de la app */}
        <Card>
          <CardHeader>
            <CardTitle>Acerca de Paws</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl mb-2">🐾</div>
              <h3 className="font-semibold text-gray-900">Paws v1.0.0</h3>
              <p className="text-sm text-gray-600">
                Tu asistente para el cuidado de mascotas
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-xs text-gray-500">
                Desarrollado con ❤️ para el bienestar animal
              </p>
              <p className="text-xs text-gray-500">
                © 2024 Paws App. Todos los derechos reservados.
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
