import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ShowcaseAuctions from '../components/showcaseAuctions';
import Countdown from '../components/countdown';
import { ethers, Signer, providers, BigNumber, utils } from "ethers";

import ACHouseContract from "../contracts/ACHouse.json";
import ACHouseToken721Contract from "../contracts/ACHouseToken721.json";
import ACHouseToken1155Contract from "../contracts/ACHouseToken1155.json";

const FrontPage = () => {

  const [ ACHouse, setACHouse] = useState(null);
  const [ ACHouse1155, setACHouse1155 ] = useState(null);
  const [ ACHouse721, setACHouse721 ] = useState(null); 
  const [ listItems, setListItems ] = useState(null); 

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
    if (ACHouse && listItems == null) {
      fetchUnSoldMarketItems();
    };
  }, [fetchUnSoldMarketItems]);

  async function fetchUnSoldMarketItems() {
		let data = await ACHouse.fetchUnSoldMarketItems().then((f) => {
			// console.log("unsold market items", f);
			return f;
		});

		// console.log("data: ", data);

		const items = await Promise.all(
			data.map(async (i) => {
				let item = {
					itemId: i.itemId.toNumber(),
					nftContract: i.nftContract,
					tokenId: i.tokenId.toNumber(),
					seller: i.seller,
					owner: i.owner,
					price: ethers.utils.formatUnits(i.price.toString(), "wei"),
					amount: i.amount.toNumber(),
					charityId: i.charityId.toNumber(),
					auctionTime: i.auctionTime.toNumber(),
					sold: i.sold,
					isMultiToken: i.isMultiToken,
					isRemoved: i.isRemoved,
					isFrac: i.isFrac,
				};
				return item;
			})
		);
		console.log("items: ", items);
    setListItems(items);
	}

  return (
    <>

    <div className="hero min-h-screen bg-primary">
      <div className="text-center hero-content text-primary-content">
        <div className="max-w-lg">
          <center><img className="mb-6" height="100" width="200" src="https://freight.cargo.site/t/thumbnail/w/100/i/7f7bbd305c0db77b741361e48b637588c0c47f141fcfb76be3e751b2adf3fff5/logo-heart-drops.svg" /></center>
          <img className="mt-6 mb-6" src="https://freight.cargo.site/t/thumbnail/w/100/i/887ac2e88349f644bf4718496c686b8d9101eb1b295bf3b0852f54e68dcf9d76/logotype-heart-drops.svg" />
          <p className="mb-5">
          A Decentralized Philanthropy (AKA “DePhi”) platform focused on bringing people together who want to make a difference in the world through life-changing NFT Drops.
              </p>
              <Link to="/auctions" className="btn bg-accent mr-2">Discover Heart Drops</Link>
              <Link to="/create" className="btn btn-secondary text-primary-content">Create an Heart Drop</Link>
        </div>
      </div>
    </div>


    <div className="py-5">
        <div className="container mx-auto p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 lg:gap-20">
            { listItems && listItems.length>0 ? listItems.map((item) => <ShowcaseAuctions key={item.id} item={item} ACHouse={ACHouse} />)  : <div className="align-center">There are currently no auctions !</div>}
          </div>
        </div>
    </div>

    <div className="py-5">
      <h2 className="my-5 text-5xl font-bold text-center">How it works</h2>
      <div className="container mx-auto p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-20">
          <div className="card lg:card-side bg-base-200">
            <div className="card-body">
              <p>The Heart Drops mission is to create an egalitarian and inclusive global community of Artists, Collectors and NGOs who want to bring about a better future using Fractionalized NFTs as the catalyst for change.</p>
            </div>
          </div>
          <div className="card lg:card-side bg-base-200">
            <div className="card-body">
              <p>Heart Drops was created as a platform where people could come together to make a difference. We believe that we are stronger together, and by setting the platform up as a Decentralized Autonomous Organization (DAO), we have the ability to put the power of positive change into many heartfelt hands.</p>
            </div>
          </div>
          <div className="card lg:card-side bg-base-200">
            <div className="card-body">
              <p>At Heart Drops we believe that every little bit helps, and everyone should have a chance to contribute to causes they feel passionate about. That is why we have focused on fractionalized NFTs using an ERC1155 smart contract to allow shared ownership of a one of a kind piece of art.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="py-5">
      <h2 className="my-5 text-5xl font-bold text-center">Community Contributions</h2>
      <div className="container mx-auto p-5">
        <div className="w-full shadow stats">
          <div className="bg-primary stat place-items-center place-content-center">
            <div className="stat-title text-white">Our Charities</div>
            <div className="stat-value text-white">3</div>
          </div>
          <div className="bg-primary stat place-items-center place-content-center">
            <div className="stat-title text-white">Number of Heart Drop</div>
            <div className="stat-value text-white">4</div>
          </div>
          <div className="bg-primary stat place-items-center place-content-center">
            <div className="stat-title text-white">Total value distributed</div>
            <div className="stat-value text-white">120Ξ</div>
          </div>
        </div>
      </div>
    </div>

    <div className="py-5">
      <h2 className="my-5 text-5xl font-bold text-center">Get involved</h2>
      <div className="container mx-auto p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 lg:gap-20">
          <div className="card shadow-2xl lg:card-side bg-accent text-secondary-content">
            <div className="card-body">
            <h2 className="text-xl font-bold text-white">Artists, Donators & Collectors</h2>
            <p>We are so happy you want to be a part of the mission! We welcome the <a href="#">gifted artist</a>, <a href="#">generous donors</a> who already own a piece they want to give, and the <a href="#">collectors</a> who buy the incredible art and invest into a better the future.</p>

              <div className="justify-end card-actions">
                <button className="btn btn-primary text-primary-content">
                      Learn more

                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 ml-2 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="card shadow-2xl lg:card-side bg-accent text-secondary-content">
            <div className="card-body">
            <h1 className="text-xl font-bold text-white">Charities</h1>
            <p>Heart Drops is here to help you make the future a better place. Existing charties can find out how to get involved <a href="#">here</a>, and we’ll get you set up with our community DAO. Make sure that you have yourself set up with a <a href="#">Crypto Wallet</a> that will allow you to receive the funds raised for your cause.</p>

              <div className="justify-end card-actions">
                <button className="btn btn-primary text-primary-content">
                      Learn more

                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 ml-2 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <br />
        <p><i>*Please note we do not work with any political groups or government organizations*</i></p>

      </div>
    </div>
    </>
  );
};

export default FrontPage;
