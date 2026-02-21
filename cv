import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  watchlistIds: JSON.parse(localStorage.getItem("watchlist")) || [],
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    toggle(state, action) {
      const id = action.payload;

      if (state.watchlistIds.includes(id)) {
        state.watchlistIds = state.watchlistIds.filter((x) => x !== id);
      } else {
        state.watchlistIds.push(id);
      }

      localStorage.setItem(
        "watchlist",
        JSON.stringify(state.watchlistIds)
      );
    },
  },
});

export const { toggle } = watchlistSlice.actions;
export default watchlistSlice.reducer;
