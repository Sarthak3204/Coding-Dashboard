import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./slices/authSlice";
import codeforcesReducer from "./slices/codeforcesSlice";
import { apiSlice } from './slices/apiSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    codeforces: codeforcesReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true
})