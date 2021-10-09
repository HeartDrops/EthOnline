import React, { useEffect, useState } from 'react';
import ShowcaseAuctions from '../components/showcaseAuctions';
import { ethers, Signer, providers, BigNumber, utils } from "ethers";
import ACHouseContract from "../contracts/ACHouse.json";
import ACHouseToken721Contract from "../contracts/ACHouseToken721.json";
import ACHouseToken1155Contract from "../contracts/ACHouseToken1155.json";

const AuctionsPage = () => {

  const [ ACHouse, setACHouse] = useState(null);
  const [ ACHouse1155, setACHouse1155 ] = useState(null);
  const [ ACHouse721, setACHouse721 ] = useState(null); 
  const [ unsoldItems, setUnsoldItems ] = useState(null); 

  // setting global var for ACHousContract.
	let contractACHouse,
      contractACHouse1155,
      contractACHouse721 = null;

  const rpcConnection = async () => {
		const ganacheUrl = "http://127.0.0.1:7545";
		let provider = new providers.JsonRpcProvider(ganacheUrl);
		// console.log("provider: ", provider);

		let chainId = await provider.getNetwork();
		// console.log("chainId: ", chainId);

		let networkId = await window.ethereum.request({
			method: "net_version",
		});
		// console.log("networkId: " + networkId);

		let providerAccounts = await provider.listAccounts();
		// console.log("providerAccts: ", providerAccounts);

		const accountOne = providerAccounts[1]; // ganache account at index 1
		const accountTwo = providerAccounts[2]; // ganache account at index 2

		// console.log("accountOne: " + accountOne + ", accountTwo: " + accountTwo);

		/******************************************************************************* */
		// This is the only thing i have to hard code. The 5777 value i am not able to find it through ether.js.. so for now this will get you the address regardless
		// of migrations.
		const ACHouseAddress = ACHouseContract.networks[5777].address;
		const ACHouse1155Address = ACHouseToken1155Contract.networks[5777].address;
		const ACHouse721Address = ACHouseToken721Contract.networks[5777].address;
		/******************************************************************************* */
		const signerOne = provider.getSigner(accountOne);

		contractACHouse = new ethers.Contract(
			ACHouseAddress,
			ACHouseContract.abi,
			signerOne
		);

		contractACHouse1155 = new ethers.Contract(
			ACHouse1155Address,
			ACHouseToken1155Contract.abi,
			signerOne
		);

		contractACHouse721 = new ethers.Contract(
			ACHouse721Address,
			ACHouseToken721Contract.abi,
			signerOne
		);

    setACHouse(contractACHouse);
    setACHouse1155(contractACHouse1155);
    setACHouse721(contractACHouse721);
	};

  if (ACHouse == null && ACHouse1155 == null && ACHouse721 == null) {
    rpcConnection();
  };

  useEffect(() => {
    if (ACHouse && unsoldItems == null) {
      ACHouse
        .fetchUnSoldMarketItems()
        .then((f) => {
            console.log("unsold market items", f);
            setUnsoldItems(f);
            console.log(f.data);
      });
    };
  });

  return (
    <>
      <h2 className="title text-4xl mb-8 my-10 mx-auto text-center font-bold text-purple-700">Current Heart Drops</h2>
      <div> <ShowcaseAuctions />
      </div>
    </>
    );
};

export default AuctionsPage;