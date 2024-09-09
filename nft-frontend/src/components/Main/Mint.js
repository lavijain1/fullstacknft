// import Navbar from "./Navbar";
import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../../pinata";
import Marketplace from "../../Marketplace.json";
import Giveaway from "../Information";
import backgroundImager from "../../images/background.jpg";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
export default function Mint() {
  const [formParams, updateFormParams] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [fileURL, setFileURL] = useState(null);
  const ethers = require("ethers");
  const [message, updateMessage] = useState("");
  const { isSignin } = useSelector((state) => state.auth);

  async function disableButton() {
    const listButton = document.getElementById("list-button");
    listButton.disabled = true;
    listButton.style.backgroundColor = "grey";
    listButton.style.opacity = 0.3;
  }

  async function enableButton() {
    const listButton = document.getElementById("list-button");
    listButton.disabled = false;
    listButton.style.backgroundColor = "#A500FF";
    listButton.style.opacity = 1;
  }

  //This function uploads the NFT image to IPFS
  async function OnChangeFile(e) {
    var file = e.target.files[0];
    //check for file extension
    try {
      //upload the file to IPFS
      disableButton();
      updateMessage("Uploading image.. please dont click anything!");
      const response = await uploadFileToIPFS(file);
      if (response.success === true) {
        enableButton();
        updateMessage("");
        console.log("Uploaded image to Pinata: ", response.pinataURL);
        setFileURL(response.pinataURL);
      }
    } catch (e) {
      console.log("Error during file upload", e);
    }
  }

  //This function uploads the metadata to IPFS
  async function uploadMetadataToIPFS() {
    const { name, description, price } = formParams;
    //Make sure that none of the fields are empty
    if (!name || !description || !price || !fileURL) {
      updateMessage("Please fill all the fields!");
      return -1;
    }

    const nftJSON = {
      name,
      description,
      price,
      image: fileURL,
    };

    try {
      //upload the metadata JSON to IPFS
      const response = await uploadJSONToIPFS(nftJSON);
      if (response.success === true) {
        console.log("Uploaded JSON to Pinata: ", response);
        return response.pinataURL;
      }
    } catch (e) {
      console.log("error uploading JSON metadata:", e);
    }
  }
  async function listNFT(e) {
    e.preventDefault();

    //Upload data to IPFS
    try {
      const metadataURL = await uploadMetadataToIPFS();
      if (metadataURL === -1) return;
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      disableButton();
      updateMessage("Uploading NFT");

      //Pull the deployed contract instance
      let contract = new ethers.Contract(
        Marketplace.address,
        Marketplace.abi,
        signer
      );

      //massage the params to be sent to the create NFT request
      const price = ethers.utils.parseUnits(formParams.price, "ether");
      let listingPrice = await contract.getListPrice();
      listingPrice = listingPrice.toString();

      //actually create the NFT
      let transaction = await contract.createToken(metadataURL, price, {
        value: listingPrice,
      });
      await transaction.wait();
      alert("Successfully Added your NFT!");
      enableButton();
      updateMessage("");

      updateFormParams({ name: "", description: "", price: "" });
    } catch (e) {
      alert("Upload error" + e);
    }
  }
  const [navigatetosignin, setnavigatetosignin] = useState(false);
  const handlesignin = () => {
    return <Navigate to="/signin" />;
  };
  if (navigatetosignin) {
    handlesignin();
  }

  return (
    <div
      className="h-100 d-flex-class align-items-center m-5 text-center"
      style={{
        backgroundImage: `url(${backgroundImager})`,
        height: "100vh",
        marginTop: "-70px",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col place-items-center mt-10" id="nftForm">
        <form className=" shadow-md rounded px-8 pt-4 pb-8 mb-4 p-5">
          <h3 className="text-center font-bold text-purple-500 mb-5 mt-5">
            Upload your NFT to the marketplace
          </h3>
          <div className="">
            <label
              className="block text-purple-500 text-sm font-bold "
              htmlFor="name"
            >
              NFT Name
            </label>
          </div>
          <div className="mb-2">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Cool NFT"
              onChange={(e) =>
                updateFormParams({ ...formParams, name: e.target.value })
              }
              value={formParams.name}
            ></input>
          </div>
          <div className="mb-6 ">
            <div>
              <label
                className="block text-purple-500 text-sm font-bold mb-2 mr-2"
                htmlFor="description"
              >
                NFT Description
              </label>
            </div>

            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              cols="40"
              rows="5"
              id="description"
              type="text"
              placeholder="Axie Infinity Collection"
              value={formParams.description}
              onChange={(e) =>
                updateFormParams({ ...formParams, description: e.target.value })
              }
            ></textarea>
          </div>
          <div className="mb-6">
            <label
              className="block text-purple-500 text-sm font-bold mb-2 mr-4"
              htmlFor="price"
            >
              Price (in ETH)
            </label>
            <input
              className="shadow mb-4 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              placeholder="Min 0.01 ETH"
              step="0.01"
              value={formParams.price}
              onChange={(e) =>
                updateFormParams({ ...formParams, price: e.target.value })
              }
            ></input>
          </div>
          <div className="text-center">
            <label
              className="block text-purple-500 text-sm font-bold mb-2 mr-2"
              htmlFor="image"
            >
              Upload Image
            </label>
          </div>
          <div className="block ml-5 text-purple-500 text-sm font-bold mb-2 mr-2">
            <input type={"file"} onChange={OnChangeFile}></input>
          </div>
          <br></br>
          <div className="text-red-500  ">{message}</div>
          {isSignin ? (
            <button
              onClick={listNFT}
              className="btn-success mb-5"
              id="list-button"
            >
              Mint this NFT
            </button>
          ) : (
            <button
              className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded text-sm"
              onClick={() => setnavigatetosignin(true)}
            >
              Sign in first to Mint this NFT.
            </button>
          )}
        </form>
      </div>
      <Giveaway />
    </div>
  );
}
