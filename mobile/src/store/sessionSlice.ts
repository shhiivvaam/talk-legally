import { createSlice } from '@reduxjs/toolkit';

const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    activeSession: null,
    sessions: [],
  },
  reducers: {
    setActiveSession: (state, action) => {
      state.activeSession = action.payload;
    },
    setSessions: (state, action) => {
      state.sessions = action.payload;
    },
  },
});

export const { setActiveSession, setSessions } = sessionSlice.actions;
export default sessionSlice.reducer;
