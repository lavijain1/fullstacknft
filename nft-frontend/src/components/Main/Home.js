import React, { useEffect } from "react";
import Hero from "../Hero";
import Giveaway from "../Information";
import OurProducts from "./Nfts";

function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <Hero />
      <OurProducts />
      <Giveaway />
    </div>
  );
}

export default Home;
