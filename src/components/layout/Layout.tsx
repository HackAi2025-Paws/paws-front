import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navigation } from './Navigation'
import { useAppSelector } from '../../hooks'

export const Layout: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Outlet />
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pb-16">
        <Outlet />
      </main>
      <Navigation />
    </div>
  )
}
