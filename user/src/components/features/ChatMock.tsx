import React, { useState, useRef, useEffect } from 'react'
import { Card } from '../ui/card.js'
import { Input } from '../ui/input.js'
import { Button } from '../ui/button.js'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar.js'
import type { ChatMessage, ChatConversation } from '../../types/index.js'
import { Send, Phone, Video, MoreVertical } from 'lucide-react'
import { formatDateTime } from '../../lib/utils.js'

interface ChatMockProps {
  conversation: ChatConversation
  onSendMessage: (message: string) => void
}

export const ChatMock: React.FC<ChatMockProps> = ({ conversation, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation.messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim())
      setNewMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header del chat */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={conversation.participantAvatar} />
              <AvatarFallback>
                {conversation.participantName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">{conversation.participantName}</h3>
              <p className="text-sm text-green-600">En línea</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 hide-scrollbar">
        {conversation.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {message.sender === 'vet' && (
                <Avatar className="h-6 w-6">
                  <AvatarImage src={conversation.participantAvatar} />
                  <AvatarFallback className="text-xs">
                    {conversation.participantName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`
                  px-4 py-2 rounded-2xl max-w-full
                  ${message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-white text-gray-900 border'
                  }
                `}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-primary-foreground/70' : 'text-gray-500'}`}>
                  {formatDateTime(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing indicator - could be shown when vet is "typing" */}
        <div className="flex justify-start">
          <div className="flex items-end space-x-2 max-w-[80%]">
            <Avatar className="h-6 w-6">
              <AvatarImage src={conversation.participantAvatar} />
              <AvatarFallback className="text-xs">
                {conversation.participantName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="bg-white border px-4 py-2 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input de mensajes */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              placeholder="Escribe tu mensaje..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-12"
            />
          </div>
          
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="icon"
            className="flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Sugerencias rápidas */}
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "Mi mascota no está comiendo",
            "¿Cuándo debo vacunar?",
            "Cambios de comportamiento",
            "Programar consulta"
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setNewMessage(suggestion)}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
