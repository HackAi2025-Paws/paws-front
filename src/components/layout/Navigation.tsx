import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Calendar, MessageCircle, HelpCircle, User } from 'lucide-react'
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
    name: 'Chat Vet',
    href: '/chat',
    icon: MessageCircle,
  },
  {
    name: 'FAQ',
    href: '/faq',
    icon: HelpCircle,
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
