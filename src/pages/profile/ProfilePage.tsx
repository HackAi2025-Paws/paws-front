import React from 'react'
import { Header } from '../../components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { logout } from '../../store/authSlice'
import { useNavigate } from 'react-router-dom'
import { User, Settings, Bell, HelpCircle, Shield, LogOut, Edit } from 'lucide-react'

export const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)
  const { pets } = useAppSelector((state) => state.pets)
  const { reminders } = useAppSelector((state) => state.reminders)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const menuItems = [
    {
      icon: Settings,
      label: 'Configuración',
      description: 'Preferencias de la aplicación',
      action: () => console.log('Configuración')
    },
    {
      icon: Bell,
      label: 'Notificaciones',
      description: 'Gestionar alertas y recordatorios',
      action: () => console.log('Notificaciones')
    },
    {
      icon: HelpCircle,
      label: 'Ayuda y soporte',
      description: 'FAQ y contacto con soporte',
      action: () => navigate('/faq')
    },
    {
      icon: Shield,
      label: 'Privacidad',
      description: 'Política de privacidad y términos',
      action: () => console.log('Privacidad')
    },
  ]

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
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-lg">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="mt-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Editar perfil
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-4">
              <p className="text-2xl font-bold text-blue-600">{pets.length}</p>
              <p className="text-xs text-gray-600 text-center">Mascotas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-4">
              <p className="text-2xl font-bold text-green-600">
                {reminders.filter(r => r.isCompleted).length}
              </p>
              <p className="text-xs text-gray-600 text-center">Completados</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-4">
              <p className="text-2xl font-bold text-orange-600">
                {reminders.filter(r => !r.isCompleted).length}
              </p>
              <p className="text-xs text-gray-600 text-center">Pendientes</p>
            </CardContent>
          </Card>
        </div>

        {/* Menú de opciones */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              return (
                <button
                  key={index}
                  onClick={item.action}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Icon className="h-5 w-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </button>
              )
            })}
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

        {/* Botón de cerrar sesión */}
        <Card className="border-red-200">
          <CardContent className="p-4">
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="w-full gap-2"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
