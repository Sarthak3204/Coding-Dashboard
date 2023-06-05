import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoggedIn: false,
}

export const loginSlice = createSlice({
  name: "logger",
  initialState,
  reducers: {
    loginUser: (state) => {
      state.isLoggedIn = true
    },
    logoutUser: (state) => {
      state.isLoggedIn = false
    }
  },
})

export const { loginUser, logoutUser } = loginSlice.actions

export default loginSlice.reducer