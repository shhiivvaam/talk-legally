import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    favoriteLawyers: [],
  },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setFavoriteLawyers: (state, action) => {
      state.favoriteLawyers = action.payload;
    },
  },
});

export const { setProfile, setFavoriteLawyers } = userSlice.actions;
export default userSlice.reducer;
