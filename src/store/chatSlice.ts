import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ChatConversation, ChatMessage } from '../types/index.js'

interface ChatState {
  conversations: ChatConversation[]
  activeConversation: ChatConversation | null
  isLoading: boolean
}

const initialState: ChatState = {
  conversations: [],
  activeConversation: null,
  isLoading: false,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<ChatConversation[]>) => {
      state.conversations = action.payload
    },
    setActiveConversation: (state, action: PayloadAction<ChatConversation | null>) => {
      state.activeConversation = action.payload
      if (action.payload) {
        // Mark as read
        const conv = state.conversations.find(c => c.id === action.payload!.id)
        if (conv) {
          conv.unreadCount = 0
        }
      }
    },
    addMessage: (state, action: PayloadAction<{ conversationId: string; message: ChatMessage }>) => {
      const { conversationId, message } = action.payload
      const conversation = state.conversations.find(c => c.id === conversationId)
      if (conversation) {
        conversation.messages.push(message)
        conversation.lastMessage = message
        if (state.activeConversation?.id !== conversationId) {
          conversation.unreadCount += 1
        }
      }
    },
    simulateVetResponse: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload
      const conversation = state.conversations.find(c => c.id === conversationId)
      if (conversation) {
        // Simulate vet response after a delay
        const responses = [
          "Entiendo tu preocupación. ¿Podrías darme más detalles?",
          "Es importante observar esos síntomas. Te recomiendo agendar una consulta.",
          "Basándome en lo que me cuentas, podría ser normal, pero mejor revisémoslo.",
          "Gracias por la información. Te sugiero algunas medidas preventivas.",
        ]
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        
        const vetMessage: ChatMessage = {
          id: Date.now().toString(),
          text: randomResponse,
          sender: 'vet',
          timestamp: new Date().toISOString()
        }
        
        conversation.messages.push(vetMessage)
        conversation.lastMessage = vetMessage
        if (state.activeConversation?.id !== conversationId) {
          conversation.unreadCount += 1
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { 
  setConversations, 
  setActiveConversation, 
  addMessage, 
  simulateVetResponse,
  setLoading 
} = chatSlice.actions
export default chatSlice.reducer
