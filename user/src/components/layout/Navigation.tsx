import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Calendar, FileText, User, HelpCircle } from 'lucide-react'
import { cn } from '../../lib/utils'

const navigationItems = [
  {
    name: 'Inicio',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Recordatorios',
    href: '/reminders',
    icon: Calendar,
  },
  {
    name: 'FAQ',
    href: '/faq',
    icon: HelpCircle,
  },
  {
    name: 'Consultas',
    href: '/consultations',
    icon: FileText,
  },
  {
    name: 'Perfil',
    href: '/profile',
    icon: User,
  },
]

export const Navigation: React.FC = () => {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50">
      <div className="flex justify-around items-center max-w-sm mx-auto">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-colors min-w-0 flex-1",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <Icon className="h-4 w-4 mb-1 flex-shrink-0" />
              <span className="text-xs font-medium truncate w-full text-center">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
