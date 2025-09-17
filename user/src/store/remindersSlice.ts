import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Reminder } from '../types/index.js'

interface RemindersState {
  reminders: Reminder[]
  isLoading: boolean
}

const initialState: RemindersState = {
  reminders: [],
  isLoading: false,
}

const remindersSlice = createSlice({
  name: 'reminders',
  initialState,
  reducers: {
    setReminders: (state, action: PayloadAction<Reminder[]>) => {
      state.reminders = action.payload
    },
    addReminder: (state, action: PayloadAction<Reminder>) => {
      state.reminders.push(action.payload)
    },
    updateReminder: (state, action: PayloadAction<Reminder>) => {
      const index = state.reminders.findIndex(reminder => reminder.id === action.payload.id)
      if (index !== -1) {
        state.reminders[index] = action.payload
      }
    },
    completeReminder: (state, action: PayloadAction<string>) => {
      const reminder = state.reminders.find(r => r.id === action.payload)
      if (reminder) {
        reminder.isCompleted = true
      }
    },
    deleteReminder: (state, action: PayloadAction<string>) => {
      state.reminders = state.reminders.filter(reminder => reminder.id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { 
  setReminders, 
  addReminder, 
  updateReminder, 
  completeReminder, 
  deleteReminder, 
  setLoading 
} = remindersSlice.actions
export default remindersSlice.reducer
