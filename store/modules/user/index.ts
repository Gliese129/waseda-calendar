import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit/react'

export interface UserState {
  isFirstLogin: boolean
  department: string
  useCourseNotifications: boolean
  displayLanguage: string
  searchLanguage: string
}

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isFirstLogin: false,
    department: '',
    useCourseNotifications: false,
    displayLanguage: 'en',
    searchLanguage: 'ja',
  },
  reducers: {
    setIsFirstLogin: (state, action: PayloadAction<boolean>) => {
      state.isFirstLogin = action.payload
    },
    setDepartment: (state, action: PayloadAction<string>) => {
      state.department = action.payload
    },
    setUseCourseNotifications: (state, action: PayloadAction<boolean>) => {
      state.useCourseNotifications = action.payload
    },
    setDisplayLanguage: (state, action: PayloadAction<string>) => {
      state.displayLanguage = action.payload
    },
    setSearchLanguage: (state, action: PayloadAction<string>) => {
      state.searchLanguage = action.payload
    },
  },
})

export const {
  setIsFirstLogin,
  setDepartment,
  setUseCourseNotifications,
  setDisplayLanguage,
  setSearchLanguage,
} = userSlice.actions

export default userSlice.reducer
