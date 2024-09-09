import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

const initialState = {
  username: "",
  useremail: "",
  userid: "",
  isSignin: false,
  currentAccount: "",
  isConnected: false,
  status: "idle",
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentAccount(state, action) {
      console.log(action.payload);
      state.currentAccount = action.payload;
      state.isConnected = true;
    },
    updateSignin(state, action) {
      console.log(action.payload);
      state.isSignin = true;
      state.username = action.payload.data.user.name;
      state.useremail = action.payload.data.user.email;
      state.userid = action.payload.data.user._id;
    },
    updateSignOut(state, action) {
      state.isSignin = false;
      state.userid = "";
      localStorage.removeItem("token");
    },
  },
  //   extraReducers: (builder) => {
  //     builder
  //       .addCase(getNFTS.pending, (state, action) => {
  //         state.status = "Loading";
  //       })
  //       .addCase(getNFTS.fulfilled, (state, action) => {
  //         state.data = action.payload.data.nfts;
  //         state.status = "Success";
  //       })
  //       .addCase(getNFTS.rejected, (state, action) => {
  //         state.data = action.payload;
  //         state.status = "Failed";
  //       });
  //   },
});
export const { updateSignin, setCurrentAccount, updateSignOut } =
  authSlice.actions;
export default authSlice.reducer;

// export const getUserInfo = createAsyncThunk("users/get", async () => {
//   const token = window.localStorage.getItem("token");
//   const axiosnew = axios.create({
//     baseURL: "http://localhost:5016/users/",
//     headers: { Authorization: token ? `Bearer ${token}` : "" },
//   });

//   const data = await fetch("http://localhost:5016/nfts/");
//   const result = data.json();
//   return result;
// });
