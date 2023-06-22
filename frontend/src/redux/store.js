import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import codeforcesReducer from "./slices/codeforcesSlice";
import atcoderReducer from "./slices/atcoderSlice";
import { apiSlice } from "./slices/apiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    codeforces: codeforcesReducer,
    atcoder: atcoderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
