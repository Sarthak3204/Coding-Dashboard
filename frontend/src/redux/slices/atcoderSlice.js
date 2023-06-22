import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  acInfo: localStorage.getItem("acInfo")
    ? JSON.parse(localStorage.getItem("acInfo"))
    : null,
};

const atcoderSlice = createSlice({
  name: "atcoder",
  initialState,
  reducers: {
    setAtcoder: (state, action) => {
      state.acInfo = action.payload;
      localStorage.setItem("acInfo", JSON.stringify(action.payload));
    },
    removeAtcoder: (state) => {
      state.acInfo = null;
      localStorage.removeItem("acInfo");
    },
  },
});

export const { setAtcoder, removeAtcoder } = atcoderSlice.actions;

export default atcoderSlice.reducer;
