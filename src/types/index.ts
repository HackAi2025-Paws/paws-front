export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Pet {
  id: string
  name: string
  breed: string
  birthDate: string
  weight: number
  photo?: string
  notes: string
  ownerId: string
  vaccinations: Vaccination[]
  appointments: Appointment[]
}

export interface Vaccination {
  id: string
  petId: string
  name: string
  date: string
  nextDue?: string
  veterinarian: string
  notes?: string
}

export interface Appointment {
  id: string
  petId: string
  type: 'consulta' | 'vacuna' | 'emergencia' | 'control'
  date: string
  veterinarian: string
  notes?: string
  status: 'programada' | 'completada' | 'cancelada'
}

export interface Reminder {
  id: string
  petId: string
  type: 'vaccination' | 'appointment' | 'medication' | 'checkup'
  title: string
  description: string
  date: string
  isCompleted: boolean
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: 'alimentacion' | 'salud' | 'comportamiento' | 'cuidados' | 'emergencias'
}

export interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'vet'
  timestamp: string
  type?: 'text' | 'image'
}

export interface ChatConversation {
  id: string
  participantName: string
  participantAvatar?: string
  messages: ChatMessage[]
  lastMessage?: ChatMessage
  unreadCount: number
}
