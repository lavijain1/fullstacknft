import React, { useState } from "react";
import user1 from "../images//users/Micheal.jpg";
import { useSelector } from "react-redux";
const Display = (props) => {
  const [walletaddress, updatewalletaddress] = useState("0x");
  const { username } = useSelector((state) => state.auth);
  const { useremail } = useSelector((state) => state.auth);
  const { isSignin } = useSelector((state) => state.auth);
  // async function getDat() {
  //   const ethers = require("ethers");
  //   //After adding your Hardhat network to your metamask, this code will get providers and signers
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const signer = provider.getSigner();
  //   const addr = await signer.getAddress();
  //   updatewalletaddress(addr);
  // }
  // if (walletaddress === "0x") getDat();

  return (
    <div>
      <div
        style={{
          backgroundColor: "black",
        }}
      >
        <div className="p-5">{console.log("TEST")}</div>
        <div
          className="d-flex ml-5 p-5 mt-5 m-5 mr-5"
          style={{ backgroundColor: "white" }}
        >
          <div class="col-md-4 px-0">
            <img src={user1} alt="" className="img-fluid" />
          </div>
          <dl class="row ml-5 mt-5 p-5 text-black">
            <dt class="col-sm-3">Name</dt>
            <dd class="col-sm-9">{username}</dd>

            <dt class="col-sm-3">Email</dt>
            <dd class="col-sm-9">
              <p>{useremail}</p>
            </dd>

            <dt class="col-sm-3">Total NFT Price</dt>
            <dd class="col-sm-9">{props.price} ETH</dd>

            <dt class="col-sm-3 text-truncate">No. of Nfts</dt>
            <dd class="col-sm-9">{props.items}</dd>
            <dt class="col-sm-3 text-truncate">Connected Wallet Address</dt>
            <dd class="col-sm-9 text-black">{props.address}</dd>
            <dd class="col-sm-9">
              <dl class="row">
                <dt class="col-sm-4"></dt>
              </dl>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
};
export default Display;
