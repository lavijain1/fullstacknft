import { createSlice } from "@reduxjs/toolkit";

const initialState = [];
const favSlice = createSlice({
  name: "fav",
  initialState,
  reducers: {
    add(state, action) {
      state.push(action.payload);
    },
    remove(state, action) {
      return state.filter((item) => item.id !== action.payload);
    },
  },
});

export const { add, remove } = favSlice.actions;
export default favSlice.reducer;
