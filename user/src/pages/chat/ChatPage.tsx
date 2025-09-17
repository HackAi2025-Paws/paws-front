import React, { useEffect } from 'react'
import { Header } from '../../components/layout/Header.js'
import { ChatMock } from '../../components/features/ChatMock.js'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.js'
import { useAppDispatch, useAppSelector } from '../../hooks/index.js'
import { setConversations, setActiveConversation, addMessage, simulateVetResponse } from '../../store/chatSlice.js'
import { mockChatConversations } from '../../data/mockData.js'
import type { ChatMessage } from '../../types/index.js'

export const ChatPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { conversations, activeConversation } = useAppSelector((state) => state.chat)

  useEffect(() => {
    // Cargar conversaciones mock
    dispatch(setConversations(mockChatConversations))
    if (mockChatConversations.length > 0) {
      dispatch(setActiveConversation(mockChatConversations[0]))
    }
  }, [dispatch])

  const handleSendMessage = (text: string) => {
    if (!activeConversation) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toISOString()
    }

    dispatch(addMessage({
      conversationId: activeConversation.id,
      message: newMessage
    }))

    // Simular respuesta de la IA después de un delay
    setTimeout(() => {
      dispatch(simulateVetResponse(activeConversation.id))
    }, 1500 + Math.random() * 2000) // Entre 1.5 y 3.5 segundos
  }

  if (!activeConversation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Chat con IA" showBack={false} />
        
        <div className="p-4">
          <Card>
            <CardHeader>
              <CardTitle>Chat con IA</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Inicia una conversación
              </h3>
              <p className="text-gray-600 text-center mb-4">
Chatea con nuestra IA especializada en cuidado de mascotas
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Chat con IA" showBack={false} />
      
      <div className="flex-1 flex flex-col">
        <ChatMock 
          conversation={activeConversation}
          onSendMessage={handleSendMessage}
        />
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border-t border-yellow-200 p-3">
        <p className="text-xs text-yellow-800 text-center">
🤖 Este es un chat con IA simulado para demostración. Proporciona información general sobre cuidado de mascotas.
        </p>
      </div>
    </div>
  )
}
