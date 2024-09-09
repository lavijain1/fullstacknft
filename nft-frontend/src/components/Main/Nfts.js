import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/our-products.css";
import "../../styles/popup.css";
import MarketplaceJSON from "../../Marketplace.json";
import { GetIpfsUrlFromPinata } from "../../utils";
// Swiper
import SwiperCore, { Navigation } from "swiper";

// IMAGES

import faved from "../../images/icons/faved.png";
import searchIcon from "../../images/icons/search.png";

import saleTag from "../../images/icons/sale-tag.png";
import animation from "../../images/animation.json";
import Lottie from "lottie-react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

SwiperCore.use([Navigation]);

function OurProducts() {
  //   const {currentUser} = useAuth()
  const dispatch = useDispatch();
  const [productsEmpty, setProductsEmpty] = useState(false);
  const swiperProductsRef = useRef(null);
  let { isConnected } = useSelector((state) => state.auth);
  let { currentAccount } = useSelector((state) => state.auth);
  const [isWide, setIsWide] = useState(false);

  const navigate = useNavigate();
  let [products, updateData] = useState([]);
  const [dataFetched, updateFetched] = useState(false);

  async function getAllNFTs() {
    const ethers = require("ethers");
    console.log(isConnected);
    if (isConnected == true) {
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      //Pull the deployed contract instance
      let contract = new ethers.Contract(
        MarketplaceJSON.address,
        MarketplaceJSON.abi,
        signer
      );
      //create an NFT Token
      let transaction = await contract.getAllNFTs();
      //Fetch all the details of every NFT from the contract and display
      let co = 0;
      console.log(transaction);
      const items = await Promise.all(
        transaction.map(async (i) => {
          if (i.currentlyListed == true) {
            var some = await contract.tokenURI(i.tokenId);
            console.log("getting this tokenUri", some);
            let toto = GetIpfsUrlFromPinata(some);
            let meta = await axios.get(toto);
            meta = meta.data;
            console.log("here");
            let price = ethers.utils.formatUnits(i.price.toString(), "ether");
            let item = {
              price,
              currentlyListed: true,
              tokenId: i.tokenId.toNumber(),
              seller: i.seller,
              owner: i.owner,
              image: meta.image,
              name: meta.name,
              description: meta.description,
            };
            return item;
          } else {
            let price = ethers.utils.formatUnits(i.price.toString(), "ether");
            let item = {
              price,
              currentlyListed: false,
              tokenId: i.tokenId.toNumber(),
              seller: i.seller,
              owner: i.owner,
            };
            return item;
          }
        })
      );
      let newitems = items.filter(function (el) {
        return el.currentlyListed == true;
      });
      console.log(items);
      updateFetched(true);
      updateData(newitems);
    }
  }

  if (!dataFetched && window.ethereum) getAllNFTs();

  useEffect(() => {
    const searchInputValue = document.querySelector(".search-input").value;
    handleSearchInputChange(searchInputValue);
  }, []);

  // SEARCH FILTER
  const [searchInputValue, setsearchInputValue] = useState("");
  const [searchedProducts, setSearchedProducts] = useState([]);
  const handleSearchInputChange = () => {
    const newProducts = products.filter((product) => {
      return product.name
        .toLowerCase()
        .includes(searchInputValue.toLowerCase());
    });
    if (newProducts.length === 0) {
      setProductsEmpty(true);
    } else {
      setProductsEmpty(false);
    }
    setSearchedProducts(newProducts);
  };

  // Sort Products
  const [activeSortButton, setActiveSortButton] = useState("highest price");

  const sortProductsByHighestPrice = (searchedProducts) => {
    const sortedProductsData = searchedProducts.slice().sort((a, b) => {
      return b.price - a.price;
    });
    updateData(sortedProductsData);
    setActiveSortButton("highest price");
  };

  const sortProductsByLowestPrice = (products) => {
    const sortedProductsData = products.slice().sort((a, b) => {
      return a.price - b.price;
    });
    updateData(sortedProductsData);
    setActiveSortButton("lowest price");
  };

  const routeChange = () => {
    navigate("/mint");
  };

  return (
    <section>
      <div className="our-products-section section">
        {/* <span className="section-title">our products</span> */}
        <div className="filter-tools d-flex justify-content-around align-items-center section-container my-2 mx-auto">
          <div className="col-xl-3 col-md-6 col-sm-6 mt-2 p-0">
            <div className="filter-option search-input-container d-flex align-items-center justify-content-start">
              <input
                className="search-input"
                onChange={(e) => {
                  setsearchInputValue(e.currentTarget.value.toLowerCase());
                  handleSearchInputChange(setsearchInputValue, products);
                }}
                placeholder="Search..."
                type="text"
              />
              <img className="search-icon" src={searchIcon} alt="search icon" />
            </div>
          </div>
          <div className=" mt-2 p-0 btn-group sort-group">
            <button
              type="button"
              className="sort-btn dropdown-toggle text-capitalize font-weight-bold"
              data-toggle="dropdown"
              aria-expanded="false"
            >
              sort by:{" "}
              <span className="text-capitalize font-weight-normal">
                {activeSortButton}
              </span>
            </button>
            <div className="dropdown-menu">
              <button
                onClick={() => sortProductsByLowestPrice(products)}
                className={`dropdown-item text-capitalize ${
                  activeSortButton === "lowest price" ? "active-sort-btn" : ""
                }`}
                href="#"
              >
                lowest price
              </button>
              <button
                onClick={() => sortProductsByHighestPrice(products)}
                className={`dropdown-item text-capitalize ${
                  activeSortButton === "highest price" ? "active-sort-btn" : ""
                }`}
                href="#"
              >
                highest price
              </button>
            </div>
          </div>
          <div className="filter-option second-hand-check p-0 mt-2 col-xl-3 col-md-6 col-sm-6 d-flex align-items-center justify-content-end ">
            <button onClick={() => routeChange()} className="p-2 btn-dark">
              Mint an NFT
            </button>
          </div>
        </div>
        {searchInputValue.length !== 0 ? (
          <div>
            <div className="section-container p-5 m-5">
              <div className="d-flex row m-0 p-0">
                {searchedProducts.map((product) => {
                  return (
                    <div
                      className="product-item col-md-4 col-sm-6 justify-content-center"
                      key={product.tokenId}
                    >
                      {product.price ? (
                        <img className="sale-tag" src={saleTag} />
                      ) : (
                        ""
                      )}
                      <Link to={`/nftpage/${product.tokenId}`}>
                        <div className="product-buttons">
                          <img
                            // onClick={(event) => addToFavs(product, event)}
                            className="product-icon add-to-favs-icon"
                            src={faved}
                            // src={product.faved ? faved : heartIcon}
                            alt="add to favorites"
                          />
                        </div>
                        <div className="product-img-container">
                          <img
                            className="product-img"
                            src={product.image}
                            alt={product.name}
                          />
                        </div>
                        <div className="product-info">
                          <span className="product-title text-dark font-weight-bold">
                            {product.name}
                          </span>

                          {product.price ? (
                            <p className="product-price-sale text-dark">
                              {product.price} ETH
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div>
            {" "}
            {products.length === 0 ? (
              <div
                className="d-flex justify-content-center"
                style={{ height: "90vh", width: "100%" }}
              >
                <Lottie animationData={animation} />
              </div>
            ) : (
              <div>
                <div className="section-container p-5 m-5">
                  <div className="d-flex row m-0 p-0">
                    {products.map((product) => {
                      return (
                        <div
                          className="product-item col-md-4 col-sm-6 justify-content-center"
                          key={product.tokenId}
                        >
                          {product.price ? (
                            <img className="sale-tag" src={saleTag} />
                          ) : (
                            ""
                          )}
                          <Link to={`/nftpage/${product.tokenId}`}>
                            <div className="product-buttons">
                              <img
                                // onClick={(event) => addToFavs(product, event)}
                                className="product-icon add-to-favs-icon"
                                src={faved}
                                // src={product.faved ? faved : heartIcon}
                                alt="add to favorites"
                              />
                            </div>
                            <div className="product-img-container">
                              <img
                                className="product-img"
                                src={product.image}
                                alt={product.name}
                              />
                            </div>
                            <div className="product-info">
                              <span className="product-title text-dark font-weight-bold">
                                {product.name}
                              </span>

                              {product.price ? (
                                <p className="product-price-sale text-dark">
                                  {product.price} ETH
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default OurProducts;
