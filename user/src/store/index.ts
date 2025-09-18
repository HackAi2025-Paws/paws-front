import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice.js'
import petsSlice from './petsSlice.js'
import remindersSlice from './remindersSlice.js'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    pets: petsSlice,
    reminders: remindersSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
