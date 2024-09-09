import React, { useEffect } from "react";
import "../styles/hero.css";

// Images
import nfthero1 from "../images/hero-slides/monkey.jpg";
import nfthero2 from "../images/hero-slides/nftimage.jpeg";
import nfthero3 from "../images/hero-slides/men.jpg";
import { useSelector } from "react-redux";

function Hero() {
  useEffect(() => {
    const nextButton = document.querySelector(".carousel-control-next-icon");
    nextButton.click();
  }, []);

  return (
    <div
      id="carouselExampleFade"
      className="carousel slide carousel-fade"
      data-ride="carousel"
    >
      <div className="carousel-inner">
        <div className="carousel-item active">
          <div className="hero-carousel-img-container">
            <img
              src={nfthero2}
              className="hero-carousel-img d-block w-100"
              alt="..."
            />
          </div>
          <div className="carousel-form">
            <span className="carousel-title text-light">
              Embrace the Power of NFTs
            </span>
            <p className="carousel-desc text-light">
              Where ownership meets digital revolution
            </p>
          </div>
        </div>
        <div className="carousel-item">
          <div className="hero-carousel-img-container">
            <img
              src={nfthero1}
              className="hero-carousel-img d-block w-100"
              alt="..."
            />
          </div>
          <div className="carousel-form">
            <span className="carousel-title text-light">
              Digital Treasures Unlocked
            </span>
            <p className="carousel-desc text-light">
              Invest in the future of digital assets.
            </p>
          </div>
        </div>
        <div className="carousel-item">
          <div className="hero-carousel-img-container">
            <img
              src={nfthero3}
              className="hero-carousel-img d-block w-100"
              alt="..."
            />
          </div>
          <div className="carousel-form">
            <span className="carousel-title text-dark">
              Become a Digital Art Collector
            </span>
            <p className="carousel-desc text-dark">
              Own the rarest digital treasures
            </p>
          </div>
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-target="#carouselExampleFade"
        data-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="sr-only">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-target="#carouselExampleFade"
        data-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="sr-only">Next</span>
      </button>
    </div>
  );
}

export default Hero;
