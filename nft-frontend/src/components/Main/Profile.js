// import Navbar from "./Navbar";
import { useLocation, useParams } from "react-router-dom";
import MarketplaceJSON from "../../Marketplace.json";
import { useState } from "react";
import saleTag from "../../images/icons/sale-tag.png";
import faved from "../../images/icons/faved.png";
import animation from "../../images/animation.json";
import Lottie from "lottie-react";
import { Link } from "react-router-dom";
import Display from "../ProfileDisplay";
import { useSelector } from "react-redux";
import Giveaway from "../Information";
// import NFTTile from "./NFTTile";

function Profile() {
  const [products, updateData] = useState([]);
  const [dataFetched, updateFetched] = useState(false);
  const [address, updateAddress] = useState("0x");
  const [totalPrice, updateTotalPrice] = useState("0");
  const { isSignin } = useSelector((state) => state.auth);

  const params = useParams();
  const tokenId = params.tokenId;
  async function getNFTData(tokenId) {
    const ethers = require("ethers");
    const axios = require("axios");
    let sumPrice = 0;
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();

    //Pull the deployed contract instance
    let contract = new ethers.Contract(
      MarketplaceJSON.address,
      MarketplaceJSON.abi,
      signer
    );

    //create an NFT Token
    let transaction = await contract.getMyNFTs();
    console.log(transaction);
    /*
     * Below function takes the metadata from tokenURI and the data returned by getMyNFTs() contract function
     * and creates an object of information that is to be displayed
     */

    const items = await Promise.all(
      transaction.map(async (i) => {
        console.log(i.tokenId);
        const tokenURI = await contract.tokenURI(i.tokenId);
        let meta = await axios.get(tokenURI, {
          headers: {
            Accept: "text/plain",
          },
        });
        meta = meta.data;

        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          currentlyListed: i.currentlyListed,
          image: meta.image,
          name: meta.name,
          description: meta.description,
        };
        sumPrice += Number(price);
        return item;
      })
    );

    updateData(items);
    updateFetched(true);
    updateAddress(addr);
    updateTotalPrice(sumPrice.toPrecision(3));
  }
  if (!dataFetched && isSignin) getNFTData(tokenId);
  async function listNFT(tokenId) {
    try {
      const ethers = require("ethers");
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      //Pull the deployed contract instance
      let contract = new ethers.Contract(
        MarketplaceJSON.address,
        MarketplaceJSON.abi,
        signer
      );
      //run the executeSale function

      let transaction = await contract.resellToken(tokenId);
      await transaction.wait();

      alert("You successfully listed the NFT!");
    } catch (e) {
      alert("Upload Error" + e);
    }
  }
  return (
    <div className="profileClass">
      {products.length === 0 ? (
        <div
          className="d-flex justify-content-center m-5 p-5"
          style={{ height: "70vh" }}
        >
          <Lottie animationData={animation} />
        </div>
      ) : (
        <div>
          {isSignin ? (
            <div>
              <Display
                address={address}
                items={products.length}
                price={totalPrice}
              />
              <div className="profileClass">
                <div className="flex flex-col text-center items-center mt-11 text-black">
                  <h2 className="font-bold">Your NFTs</h2>
                  <div className="flex justify-center flex-wrap max-w-screen-xl">
                    <div className="section-container p-5">
                      <div className="d-flex row m-0 p-0">
                        {products.map((product) => {
                          return (
                            <div
                              className="product-item col-md-4 col-sm-6 justify-content-center"
                              key={product.id}
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
                                      ETH {product.price}
                                    </p>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </Link>
                              {product.currentlyListed == false ? (
                                <button
                                  onClick={() => {
                                    listNFT(product.tokenId);
                                  }}
                                >
                                  {console.log(product)} List NFT
                                </button>
                              ) : (
                                <p>Available for sale</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 text-xl">
                    {products.length == 0
                      ? "Oops, No NFT data to display (Are you logged in?)"
                      : ""}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ margin: "30px", padding: "40px" }}>
              <div
                className="d-flex justify-content-center"
                class="d-inline p-2 bg-dark text-white"
              >
                Please Sign In First
              </div>
              <Giveaway />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
