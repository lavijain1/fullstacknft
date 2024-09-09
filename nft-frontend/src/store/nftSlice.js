import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

const initialState = {
  data: [],
  status: "idle",
};
const nftSlice = createSlice({
  name: "nfts",
  initialState,
  reducers: {},
});
export default nftSlice.reducer;
