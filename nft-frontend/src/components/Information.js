import React from "react";
import "../styles/giveaway.css";
import airJordans from "../images/giveaway/girl1.jpg";
import downloadApp from "../images/giveaway/download-app.png";
import share from "../images/giveaway/share.png";
import firstOperation from "../images/giveaway/first-operation.png";
import done from "../images/giveaway/done.png";
import instagram from "../images/giveaway/instagram.png";

function Giveaway() {
  return (
    <section className="giveaway-section">
      <div className="container">
        <h6 className="section-title"></h6>
        <p className="mx-auto text-center text-uppercase section-info">
          Leverage the power of zero Knowledge proofs
        </p>
        <div className="justify-content-center align-items-center row col-12 p-0 m-0">
          <div className="col-md-3">
            <div className="row m-0 p-0 justify-content-center">
              <div className="justify-content-center giveaway-item">
                <img
                  className="download-app-icon giveaway-icon mx-auto d-block"
                  src={downloadApp}
                />
                <p className="text-center">Using Polygon ID</p>
              </div>
            </div>
            <div className="row m-0 p-0 justify-content-center">
              <div className="justify-content-center giveaway-item">
                <img
                  className="download-app-icon giveaway-icon mx-auto d-block"
                  src={share}
                />
                <p className="text-center">share with friends</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <img className="air-jordans" src={airJordans} />
          </div>
          <div className="col-md-3">
            <div className="row m-0 p-0 justify-content-center">
              <div className="justify-content-center giveaway-item">
                <img
                  className="download-app-icon giveaway-icon mx-auto d-block"
                  src={firstOperation}
                />
                <p className="text-center">Mint Your First NFT</p>
              </div>
            </div>
            <div className="row m-0 p-0 justify-content-center">
              <div className="justify-content-center giveaway-item">
                <img
                  className="download-app-icon giveaway-icon mx-auto d-block"
                  src={instagram}
                />
                <p className="text-center">Truly Decentralized</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="row m-0 p-0 justify-content-center">
              <div className="justify-content-center giveaway-item">
                <img
                  className="download-app-icon giveaway-icon mx-auto d-block"
                  src={done}
                />
                <p className="text-center">Protection From Bots and Spam</p>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: "smooth",
            });
          }}
          className="text-uppercase btn-start-now"
        >
          start now
        </button>
      </div>
    </section>
  );
}

export default Giveaway;
