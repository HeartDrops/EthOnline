import React, { useState, useEffect } from "react";
import Connect from "./connect";
import { ethers, Signer, providers, BigNumber, utils } from "ethers";
import coinGecko from '../api/coinGecko';

import ACHouseContract from "../contracts/ACHouse.json";
import ACHouseToken721Contract from "../contracts/ACHouseToken721.json";
import ACHouseToken1155Contract from "../contracts/ACHouseToken1155.json";

const BuyForm = () => {
	const [connected, setConnected] = useState(false);
	const [balance, setBalance] = useState(0);
	const [errors, setErrors] = useState(null);
	const [timer, setTimer] = useState(null);
	const [step, setStep] = useState(0); // setStep to change page

	const [ ethPrice, setEthPrice ] = useState(null);

	const [ tokenSupply, setTokenSupply ] = useState(200); // remaining amount of tokens
	const [ validSupply, setValidSupply ] = useState(true);
	const [ tokenPrice, setTokenPrice ] = useState(null); // value of 1 token for a given marketitem
	const [ tokenSymbol, setTokenSymbol ] = useState(null);
	const [ donationAmtUSD, setDonationAmtUSD ] = useState(null);
  	const [ donationAmtEth, setDonationAmtEth ] = useState(0);
	const [ donationAmtTokens, setDonationAmtTokens ] = useState(null);
	const [ deadline, setDeadline ] = useState(false); 
	// Gas fees
	const [gasFeesETH, setGasFeesETH] = useState(0);
	const [gasFeesUSD, setGasFeesUSD] = useState(0);
	// tx information
	const [transactionSucceeded, setTransactionSucceeded] = useState(null);

	// setting global var for ACHousContract.
	let contractACHouse,
		contractACHouse1155,
		contractACHouse721,
        contractACHouseProvider = null;

	// nb of tokens received for a given amount of eth
	const [minReceivedToken, setMinReceivedTokens] = useState(0);

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

        contractACHouseProvider = new ethers.Contract(
			ACHouseAddress,
			ACHouseContract.abi,
			provider
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
		// console.log("contractACHouse", contractACHouse);

		// setContractACHouse(contractACHouse);
	};
	rpcConnection();

	// Price of ETH
	const getEthPrice = async () => {
		const ethPrice = await
		  coinGecko.get(`/simple/price/`, {
			params: {
			  ids: "ethereum",
			  vs_currencies: 'usd',
			},
		  });
		setEthPrice(ethPrice.data.ethereum.usd);
	}
	
	if (ethPrice == null) {
		getEthPrice();
	}

	const getMarketItemInfoHandler = () => {

		setTokenSupply(200);
		setTokenPrice(0.015); 
		setTokenSymbol('$HEART');
		setDeadline(true);

	};
	

	useEffect(() => {       

		async function getUserInfo() {
			// if (
			// 	typeof window.ethereum !== "undefined" ||
			// 	typeof window.web3 !== "undefined"
			// ) {
			// 	// Web3 browser user detected. You can now use the provider.
			// 	const accounts = await window.ethereum.request({
			// 		method: "eth_requestAccounts",
			// 	});
			//     // let provider = ethers.getDefaultProvider();
			// 	let provider = new ethers.providers.Web3Provider(window.ethereum);
			// 	// console.log('accounts: ', accounts);
			// 	// console.log('provider: ', provider);
			// 	const signer = provider.getSigner();
			// 	// console.log('signer:', signer);
			// 	setConnected(true);
			// 	signer
			// 		.getAddress()
			// 		.then((address) => {
			// 			// console.log('address', address);
			// 			return provider.getBalance(address);
			// 		})
			// 		.then((rawBalance) => {
			// 			// console.log(rawBalance);
			// 			const value = parseFloat(ethers.utils.formatEther(rawBalance));
			// 			// console.log('balance:', value);
			// 			setBalance(value);
			// 		});
			// 	// const test = provider.getGasPrice();
			// 	// console.log('gas price:', test);
			// }
		}
		// getUserInfo();

		// get marketItemInformation
		getMarketItemInfoHandler();

	});

	const selectNextHandler = () => {
		if (step < 2) {
			setStep((prevActiveStep) => prevActiveStep + 1);
			console.log("next");
		} else {
			console.log("no");
		}
	};

	const selectPrevHandler = () => {
		if (step > 0) {
			setStep((prevActiveStep) => prevActiveStep - 1);
			console.log("next");
		} else {
			console.log("no");
		}
	};

	const changeInputETH = (e) => {
		setErrors(null);
		setDonationAmtEth(null);
		setDonationAmtTokens(null);
		setDonationAmtUSD(null);

		if (timer) {
			clearTimeout(timer);
			setTimer(null);
		}
		setTimer(
			setTimeout(() => {

				mintingNFTs();

				const pattern = /^(0|[1-9]\d*)(\.\d+)?$/;
				if (pattern.test(e.target.value)) { // check if input is a valid number

					const priceInEth = e.target.value;
					setDonationAmtEth(priceInEth);
					setDonationAmtUSD(priceInEth * ethPrice);

					// get nb of tokens for given amount of eth
					const nbTokens = +priceInEth / +tokenPrice;
					setDonationAmtTokens(nbTokens);

					// calculate estimated fees

					// calculate donation amount to charity
					
				} else {
					// input is not a number
					// console.log('PAS un nombre');
					const newError = "Please enter a decimal number";
					setErrors(newError);
				}
			}, 1000)
		);
	};

	const mintNFT1155 = () => {

		contractACHouse.createNFT1155(1, 1).then((f) => {
			console.log("after calling CreateNFT1155", f);
		});
	};

	const createMarketItem1155 = () => {

		//Since you used ACHouse1155 contract to create the Tokens, you should pass the address of the contract where the token resides (was created).
		// Same applies for NFT create outside of our system.
		contractACHouse
			.create1155MarketItem(contractACHouse1155.address, 1, 10, 1, 1, 1634309818)
			.then((f) => {
				console.log("after create 1155 MarketItem", f);
			});
	};

    const fractionalizeMarketItem1155 = () => {
        // fractionalize721NFT(address nftContract, uint256 tokenId, uint256 shardId, uint256 priceOfShard, uint256 supplyToCreate, string memory uri) => uint256
		contractACHouse
			.fractionalize1155NFT(contractACHouse.address, 1, 1, 2, 200, 'test' )
			.then((f) => {
				console.log("fractionalize1155NFT", f);
			});
        // get an error 

        // QUESTIONS : 
        //  -- how to get list of current auctions ? 
        //  -- where does the person who fractionalize an NFT set the charities it goes to ? (so I can fetch the right charity in the buyer page)
		//  -- identify the right MarketItem in a given auction page 
		//		(in order to get :
		//			- the total supply of tokens 
		// 			- remaining nb of tokens + their price (is the price in ETH ?)
		// 			- the right charity it goes to
		// 			- end date of the auction
		//  -- 
	};

	const createNGO = () => {
		const addr = "0xbAF4F56323F3b57b4a1E1191ac62F19b7Fd549C4";
		const name = 'ABC'
		
		// contractACHouse
		// 	.addCharity(addr, name)
		// 	.then((f) => {
		// 	console.log("add charity", f);
		// });
	};
	const setParentApproval = () => {
		contractACHouse1155
            .setParentApproval()
            .then((f) => {
			    console.log("parent address", f);
		});
	}

	const mintingNFTs = () => {
		console.log("Calling MintNFT1155");
		// mintNFT1155();
		// setParentApproval();
		// createMarketItem1155();
		// fractionalizeMarketItem1155();

		// createNGO();
		// contractACHouse
		// 	.getCharityInfo(1)
		// 	.then((f) => {
		// 	console.log("get charity", f);
		// }); // get charity "ABC"

		contractACHouse
            .fetchItemsCreated()
            .then((f) => {
			    console.log("unsold market items", f);
		});
		
        // contractACHouseProvider
        //     .getTokenIds()
        //     .then((f) => {
		// 	    console.log("Get token Ids", f);
		// });
        // contractACHouseProvider
        //     .getTokenSupply(1)
        //     .then((f) => {
		// 	    console.log("Get token supply for marketItemId = 1", f);
		// });
	};

	const estimateFees = async () => {
		// function to calculate estimated fees

		const gasPrice = await provider.getGasPrice();
		console.log("Big number: ", gasPrice);

		const gasPriceGwei = utils.formatUnits(gasPrice, "gwei");
		console.log("gas price in gwei: ", gasPriceGwei);

		// await provider.estimateGas({
		//     // Wrapped ETH address
		//     to: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",

		//     // `function deposit() payable`
		//     data: "0xd0e30db0",

		//     // 1 ether
		//     value: parseEther("1.0")
		//   });

		setGasFeesETH(gasPriceGwei);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("form submitted");
		selectNextHandler();

		// 1. check that all variables are ok

		// 2. effectuer la transaction

		// 3. check that transaction was complete
		// and get nb of TOKENS owned + amount donated to charity

		// 4. show conclusion page
		// setTransactionSucceeded(true);
	};

	const handleTransaction = () => {

		// connect to smart contract to handle transaction

		// if success 
		selectNextHandler();		
	};

	return (
		<>
			{step == 0 && (
				<>
					<form className="" onSubmit={handleSubmit}>
						<div className="form-control">
							<label className="label font-bold h-6 mt-3 text-gray-600 text-xs leading-8 uppercase">
								<span className="label-text">Pay (in ETH)</span>
								{ donationAmtUSD ? <span> ({donationAmtUSD} USD)</span> : "" }
								{/* <span>Balance user: {balance} ETH</span> */}
							</label>
							<input
								type="text"
								placeholder="0.0"
								className="input input-primary input-bordered"
								required
								inputMode="decimal"
								pattern="^\d*[.,]?\d*$"
								onChange={changeInputETH}
							/>
							{errors ? (
								<div className="alert alert-error">
									<div className="flex-1">
										<label>{errors}</label>
									</div>
								</div>
							) : (
								""
							)}
						</div>
						<div className="form-control mb-5">
							<label className="label font-bold h-6 mt-3 text-gray-600 text-xs leading-8 uppercase">
								<span className="label-text">Receive {tokenSymbol}</span>
							</label>
							<input
								type="text"
								placeholder="0.0"
								// value={donationAmtTokens || ""}
								className="input input-primary input-bordered"
								inputMode="decimal"
							/>
						</div>
						<div className="py-2">
							<p>Remaining nb of tokens:<span className="font-bold h-6 mt-3 text-gray-600 leading-8 uppercase"> {tokenSupply} {tokenSymbol}</span></p>
						</div>
						<div className="py-2">
							<p>Estimate ETH price of 1 {tokenSymbol}: <span className="font-bold h-6 mt-3 text-gray-600 leading-8 uppercase">{tokenPrice} ETH</span></p>
						</div>
						<div className="py-2">
							<p>Estimated fees: <span className="font-bold h-6 mt-3 text-gray-600 leading-8 uppercase">{gasFeesETH} ETH / {gasFeesUSD}$</span></p>
						</div>
						<div className="py-2">
							{ donationAmtTokens ? 
								<p>Min. received: <span className="font-bold h-6 mt-3 text-gray-600 leading-8 uppercase">{donationAmtTokens} {tokenSymbol}</span></p>
							: <span>Min. received: -</span>
							}
						</div>
						<div className="py-2">
							<span>Donation amount to charity: { donationAmtEth && donationAmtUSD ? <span className="font-bold h-6 mt-3 text-gray-600 leading-8 uppercase">{donationAmtEth} ETH - {donationAmtUSD} $</span>: <span className="font-bold h-6 mt-3 text-gray-600 leading-8 uppercase">-</span>}</span>
						</div>
						<div className="center-cnt py-2">
							{!connected ? (
								<button className="btn btn-secondary btn-wide">Donate</button>
							) : (
								<Connect />
							)}
						</div>
					</form>
				</>
			)}
			{step == 1 && (
				<>
					<div className=" my-20 flex items-center justify-center">
						<div className="max-w-4xl  bg-white rounded-lg shadow-xl">
							<div className="p-4 border-b">
								<h2 className="text-2xl ">
									Please confirm your transaction information
								</h2>
								<p className="text-sm text-gray-500"></p>
							</div>
							<div>
								<div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
									<p className="text-gray-600">Wallet</p>
									<p>Wallet address</p>
								</div>
								<div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
									<p className="text-gray-600">NFT URI</p>
									<p>Insert URI</p>
								</div>
								<div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
									<p className="text-gray-600">Donation amount</p>
									<p>$ {donationAmtUSD} / {donationAmtEth}ETH</p>
								</div>
								<div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
									<p className="text-gray-600">Number of tokens purchased</p>
									<p>200 {tokenSymbol}</p>
								</div>
								<div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
									<p className="text-gray-600">Estimated fees </p>
									<p>Gas fees (eth and USD)</p>
								</div>
							</div>
						</div>
					</div>
					<div className="center-cnt py-2">
						<button
							className="btn btn-secondary btn-wide mx-2"
							onClick={selectPrevHandler}
						>
							Previous
						</button>
						<button
							className="btn btn-primary btn-wide mx-2"
							onClick={handleTransaction}
						>
							Validate transaction
						</button>
					</div>
				</>
			)}
			{step == 2 && (
				<>
					<div>
						{!transactionSucceeded ? (
							<div>transaction failed</div>
						) : (
							<div>
								<div className="py-3 text-center">
									Congratulations ! You now own XX $TOKENS
								</div>
								<div className="py-3 text-center">
									You donated YYY ETH to CHARITY_NAME
								</div>
								<div className="center-cnt py-2">
									<button className="btn btn-secondary btn-wide">Share</button>
								</div>
							</div>
						)}
					</div>
				</>
			)}
		</>
	);
};

export default BuyForm;
