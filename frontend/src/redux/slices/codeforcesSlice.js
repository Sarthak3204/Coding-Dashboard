import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cfInfo: localStorage.getItem('cfInfo')
    ? JSON.parse(localStorage.getItem('cfInfo'))
    : null
};

const codeforcesSlice = createSlice({
  name: 'codeforces',
  initialState,
  reducers: {
    setCodeforces: (state, action) => {
      state.cfInfo = action.payload;
      localStorage.setItem('cfInfo', JSON.stringify(action.payload));
    }
  }
});

export const { setCodeforces } = codeforcesSlice.actions;

export default codeforcesSlice.reducer;