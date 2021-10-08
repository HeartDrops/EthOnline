import React, { useState } from 'react';
import { ethers } from 'ethers'
import Web3Modal from "web3modal";

const generateMessageSignature = () => {
  return (
    '******************************************************************************** \n' +
    'Welcome to Heart Drops \n' +
    '******************************************************************************** \n' 
  );
}

const generateSignature = async (signer, userAddy ) => {
  let signed;
  const message = generateMessageSignature();
  signed = await signer.signMessage(message);
};



const Connect = (props) => {
  const [connected, setConnected] = useState(false);

  const Connection = async () => {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    if (signer._isSigner) {
      const userAddy = await signer.getAddress();
      const signature = await generateSignature(signer, userAddy);
      setConnected(true);
    } else {
      console.log('error');
    }
  };

  return (
    <>
    <button 
        className="btn btn-info"
        onClick={Connection}
    >
    {!connected ? <p>Connect wallet</p> : <p>Connected</p>}
    </button> 
    </>
  );
};

export default Connect;