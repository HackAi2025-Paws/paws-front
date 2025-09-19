import React from 'react'
import { Button } from '../ui/button'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  title: string
  showBack?: boolean
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  showBack = false
}) => {
  const navigate = useNavigate()

  return (
    <header className="header-5colors border-b border-red-200 px-4 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-10 w-10 text-white hover:bg-white/20 rounded-2xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-2xl font-semibold text-white font-poppins">{title}</h1>
        </div>

        <div></div>
      </div>
    </header>
  )
}
