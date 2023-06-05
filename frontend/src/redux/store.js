import { configureStore } from '@reduxjs/toolkit'
import loginReducer from "./slices/loginSlice"

export const store = configureStore({
  reducer: {
    logger: loginReducer,
  },
})