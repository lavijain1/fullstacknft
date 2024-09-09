import React, { useState, useEffect, useRef } from "react";
import "../styles/navbar.css";
import { useLocation, Link } from "react-router-dom";

// Images
import logo from "../images/logo.png";
import whiteLogo from "../images/logo.png";
import metamaskIcon from "../images/icons/metamask1.png";
import sidebar from "../images/icons/sidebar.png";
import whiteSidebar from "../images/icons/white-sidebar.png";
import whiteUserIcon from "../images/icons/white-user.png";
import userIcon from "../images/icons/user.png";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentAccount, updateSignOut } from "../store/authSlice";

function Navbar() {
  const [locationHome, setLocationHome] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { isSignin } = useSelector((state) => state.auth);
  const connectWallet = async () => {
    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId !== "0xaa36a7") {
        alert("Incorrect network! Switch your metamask network to Sepolia");
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }],
        });
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      dispatch(setCurrentAccount(accounts[0]));
    } catch (error) {
      console.log("Error Connecting to wallet");
    }
  };
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
  }, []);
  const currentLocation = location.pathname;
  useEffect(() => {
    if (currentLocation === "/") {
      setLocationHome(true);
    } else {
      setLocationHome(false);
    }
  }, [currentLocation]);

  // Check Window Scroll To Change Navbar Color from transparent to white
  const [isNotTop, setNotTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (!locationHome) {
        setNotTop(true);
      } else {
        if (window.scrollY > 10) {
          setNotTop(true);
        } else {
          setNotTop(false);
        }
      }
    };
    handleScroll();

    window.addEventListener("scroll", handleScroll);
  }, [locationHome]);

  const logout = () => {
    dispatch(updateSignOut());
  };
  const [username, setUsername] = useState("");

  return (
    <div
      className={
        isNotTop ? "navbar-section bg-light nav-shadow" : "navbar-section"
      }
    >
      <div className="section-container">
        <nav className="d-flex align-items-center navbar navbar-expand-lg d-flex justify-content-between align-items-center row col-12 p-0 m-0">
          <Link
            to="/"
            className="nav-brand col-2 justify-content-start align-items-center p-0"
          >
            <img className="nav-logo" src={isNotTop ? logo : whiteLogo} />
          </Link>

          <div
            className="collapse navbar-collapse justify-content-center width"
            id="collapseWidthExample"
          >
            <button
              className="close-sidebar"
              data-toggle="collapse"
              data-target="#collapseWidthExample"
              aria-controls="collapseWidthExample"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              X
            </button>

            <div className="nav-sidebar-logo d-none justify-content-center p-0">
              <img className="nav-logo" src={logo} />
            </div>
            <ul className="navbar-nav d-flex mt-4">
              <li
                className="nav-item"
                data-toggle="collapse"
                data-target="#collapseWidthExample"
                aria-controls="collapseWidthExample"
                aria-expanded="false"
                aria-label="Toggle navigation"
              ></li>
              <div className="ml-5">{console.log("")}</div>
              <div className="ml-5">{console.log("")}</div>
              <div className="ml-5">{console.log("")}</div>
              <div className="ml-5">{console.log("")}</div>
              <li
                className="nav-item ml-5"
                data-toggle="collapse"
                data-target="#collapseWidthExample"
                aria-controls="collapseWidthExample"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <Link
                  to="/"
                  className={isNotTop ? "nav-link" : "nav-link text-white"}
                >
                  Marketplace
                </Link>
              </li>
              <li
                className="nav-item"
                data-toggle="collapse"
                data-target="#collapseWidthExample"
                aria-controls="collapseWidthExample"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <Link
                  to="/profile"
                  className={isNotTop ? "nav-link" : "nav-link text-white"}
                >
                  Your NFTs
                </Link>
              </li>
            </ul>
          </div>
          <div className="d-flex justify-content-end align-items-center nav-icons col-4">
            <button
              onClick={() => {
                connectWallet();
              }}
              className="nav-btn"
            >
              <img
                className="nav-fav-icon nav-icon"
                src={isNotTop ? metamaskIcon : metamaskIcon}
              />
            </button>
            {/* <Favs ref={favsRef} className={displayFavs ? "" : "d-none"} /> */}
            <div className="dropdown">
              <button
                className="nav-btn p-0"
                type="button"
                data-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  className="nav-user-icon nav-icon"
                  src={isNotTop ? userIcon : whiteUserIcon}
                />
              </button>
              <div className="dropdown-menu">
                <Link className={true ? "dropdown-item" : "d-none"} to="#">
                  Hello {username} :)
                </Link>
                <Link className={true ? "dropdown-item" : "d-none"} to="/mint">
                  Mint NFT
                </Link>

                <Link
                  className={isSignin ? "dropdown-item" : "d-none"}
                  to="#"
                  onClick={() => {
                    logout();
                  }}
                >
                  Logout
                </Link>
                <Link
                  className={isSignin ? "d-none" : "dropdown-item"}
                  to="/signup"
                >
                  sign up
                </Link>
                <Link
                  className={isSignin ? "d-none" : "dropdown-item"}
                  to="/signin"
                >
                  sign in
                </Link>
              </div>
            </div>
          </div>
          <div
            className="nav-sidebar navbar-toggler col-2"
            data-toggle="collapse"
            data-target="#collapseWidthExample"
            aria-controls="collapseWidthExample"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <img
              className="nav-sidebar-icon nav-icon navbar-toggler-icon p-1"
              src={isNotTop ? sidebar : whiteSidebar}
            />
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
