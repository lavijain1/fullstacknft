// import axie from "../tile.jpeg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MarketplaceJSON from "../../Marketplace.json";
import axios from "axios";
import { useEffect, useState } from "react";
import { GetIpfsUrlFromPinata } from "../../utils";
import bg from "../../images/background.jpg";
import animation from "../../images/animation1.json";
import Lottie from "lottie-react";
import owned from "../../images/icons/owned.jpg";
import { useSelector } from "react-redux";

export default function NFTPage(props) {
  const [data, updateData] = useState({});
  const [dataFetched, updateDataFetched] = useState(false);
  const [message, updateMessage] = useState("");
  const [currAddress, updateCurrAddress] = useState("0x");
  const navigate = useNavigate();
  const params = useParams();
  const { isSignin } = useSelector((state) => state.auth);

  const tokenId = params.tokenId;
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  async function getNFTData(tokenId) {
    const ethers = require("ethers");
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
    var tokenURI = await contract.tokenURI(tokenId);
    const listedToken = await contract.getListedTokenForId(tokenId);
    tokenURI = GetIpfsUrlFromPinata(tokenURI);
    let meta = await axios.get(tokenURI);
    meta = meta.data;
    console.log(listedToken);

    let item = {
      price: meta.price,
      tokenId: tokenId,
      seller: listedToken.seller,
      owner: listedToken.owner,
      image: meta.image,
      name: meta.name,
      description: meta.description,
    };
    console.log(item);
    updateData(item);
    updateDataFetched(true);
    console.log("address", addr);
    updateCurrAddress(addr);
  }

  async function buyNFT(tokenId) {
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
      const salePrice = ethers.utils.parseUnits(data.price, "ether");
      updateMessage("Buying the NFT... Please Wait (Upto 5 mins)");
      //run the executeSale function
      let transaction = await contract.executeSale(tokenId, {
        value: salePrice,
      });
      await transaction.wait();

      alert("You successfully bought the NFT!");
      navigate("/profile");

      updateMessage("");
    } catch (e) {
      alert("Upload Error" + e);
    }
  }

  if (!dataFetched) getNFTData(tokenId);
  if (typeof data.image == "string")
    data.image = GetIpfsUrlFromPinata(data.image);

  return (
    <div
      style={{
        "min-height": "100vh",
        backgroundColor: "#232B2B",
      }}
    >
      <div className="p-5">{console.log(data.name)}</div>

      {dataFetched ? (
        <div
          className="d-flex ml-5 p-5 mt-5 m-5 mr-5"
          style={{ backgroundColor: "white", backgroundImage: `url(${bg})` }}
        >
          <div class="col-md-4 px-0">
            <img src={data.image} alt="" className="img-fluid" />
          </div>
          <dl class="row ml-5 mt-5 p-5 text-black">
            <dt class="col-sm-3">Name</dt>
            <dd class="col-sm-9">{data.name}</dd>

            <dt class="col-sm-3">Description</dt>
            <dd class="col-sm-9">
              <p>{data.description}</p>
            </dd>

            <dt class="col-sm-3">Price</dt>
            <dd class="col-sm-9">{data.price} ETH</dd>

            <dt class="col-sm-3 text-truncate">Owner</dt>
            <dd class="col-sm-9">{data.owner}</dd>
            <dt class="col-sm-3 text-truncate">Seller</dt>
            <dd class="col-sm-9">{data.seller}</dd>
            <dd class="col-sm-9">
              <dl class="row">
                <dt class="col-sm-4">
                  {isSignin ? (
                    <div>
                      {currAddress != data.owner &&
                      currAddress != data.seller ? (
                        <button
                          className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded text-sm"
                          onClick={() => buyNFT(tokenId)}
                        >
                          Buy this NFT
                        </button>
                      ) : (
                        <div className="text-emerald-700">
                          <img
                            src={owned}
                            style={{ height: "100px", width: "100px" }}
                          ></img>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-emerald-700">
                      <button
                        className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded text-sm"
                        onClick={() => navigate("/signin")}
                      >
                        Sign in first to buy this NFT.
                      </button>
                    </div>
                  )}
                </dt>
              </dl>
            </dd>
          </dl>
        </div>
      ) : (
        <div
          className="d-flex ml-5 p-5 mt-5 m-5 mr-5 justify-content-center"
          style={{ backgroundColor: "white", backgroundImage: `url(${bg})` }}
        >
          <div
            className="d-flex justify-content-center"
            style={{ height: "60vh" }}
          >
            <Lottie animationData={animation} />
          </div>
        </div>
      )}
    </div>
  );
}
