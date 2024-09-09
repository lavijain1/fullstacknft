import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Main/Home";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Footer from "./components/Footer";
import Profile from "./components/Main/Profile";
import Mint from "./components/Main/Mint";
import NFTPage from "./components/Main/BuyNft";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mint" element={<Mint />} />
        <Route path="/nftpage/:tokenId" element={<NFTPage />} />

        {/* <Route path="/products/:productId" element={<ProductPage/>} />  
          <Route path="/addresses" element={<Addresses/>} />  
          <Route path="/accessories" element={<Accessories/>} />  
          <Route path="/shoes" element={<Shoes/>} />  
          <Route path="/jackets" element={<Jackets/>} />  
          <Route path="/sales" element={<Sales/>} />  
          <Route path="/checkout" element={<Checkout/>} />   */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
