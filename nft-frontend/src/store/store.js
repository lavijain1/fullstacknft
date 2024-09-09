import { configureStore } from "@reduxjs/toolkit";
import favSlice from "./favSlice";
import nftSlice from "./nftSlice";
import authSlice from "./authSlice";
const store = configureStore({
  reducer: {
    fav: favSlice,
    nfts: nftSlice,
    auth: authSlice,
  },
});

export default store;
