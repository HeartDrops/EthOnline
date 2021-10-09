import React, { useState, useEffect } from "react";
import Connect from "./connect";
import { ethers, Signer, providers, BigNumber, utils } from "ethers";
import coinGecko from "../api/coinGecko";

import ACHouseContract from "../contracts/ACHouse.json";
import ACHouseToken721Contract from "../contracts/ACHouseToken721.json";
import ACHouseToken1155Contract from "../contracts/ACHouseToken1155.json";

const BuyForm = (props) => {

	console.log('props', props);


	const [connected, setConnected] = useState(false);
	const [balance, setBalance] = useState(0);
	const [errors, setErrors] = useState(null);
	const [timer, setTimer] = useState(null);
	const [step, setStep] = useState(0); // setStep to change page

	const [ethPrice, setEthPrice] = useState(null);

	const [tokenSupply, setTokenSupply] = useState(200); // remaining amount of tokens
	const [validSupply, setValidSupply] = useState(true);
	const [tokenPrice, setTokenPrice] = useState(null); // value of 1 token for a given marketitem
	const [tokenSymbol, setTokenSymbol] = useState(null);
	const [donationAmtUSD, setDonationAmtUSD] = useState(null);
	const [donationAmtEth, setDonationAmtEth] = useState(0);
	const [donationAmtTokens, setDonationAmtTokens] = useState(null);
	const [deadline, setDeadline] = useState(false);
	// Gas fees
	const [gasFeesETH, setGasFeesETH] = useState(0);
	const [gasFeesUSD, setGasFeesUSD] = useState(0);
	// tx information
	const [transactionSucceeded, setTransactionSucceeded] = useState(null);

	// setting global var for ACHousContract.
	let contractACHouse,
		contractACHouseBuyer,
		contractACHouse1155,
		contractACHouse721,
		contractACHouseProvider,
		accountOneSigner,
		accountTwoSigner = null;

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
		const signerTwo = provider.getSigner(accountTwo);

		accountOneSigner = signerOne;
		accountTwoSigner = signerTwo;

		contractACHouse = new ethers.Contract(
			ACHouseAddress,
			ACHouseContract.abi,
			signerOne
		);

		contractACHouseBuyer = new ethers.Contract(
			ACHouseAddress,
			ACHouseContract.abi,
			signerTwo
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
		const ethPrice = await coinGecko.get(`/simple/price/`, {
			params: {
				ids: "ethereum",
				vs_currencies: "usd",
			},
		});
		setEthPrice(ethPrice.data.ethereum.usd);
	};

	if (ethPrice == null) {
		getEthPrice();
	}

	const getMarketItemInfoHandler = () => {
		setTokenSupply(200);
		setTokenPrice(0.015);
		setTokenSymbol("$HEART");
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
				console.log("value", e.target.value);
				if (pattern.test(e.target.value)) {
					// check if input is a valid number

					const priceInEth = e.target.value;
					setDonationAmtEth(priceInEth);
					setDonationAmtUSD(priceInEth * ethPrice);

					// get nb of tokens for given amount of eth
					const nbTokens = +priceInEth / +tokenPrice;
					setDonationAmtTokens(nbTokens);

					// calculate estimated fees
					// estimateFees();
				} else if (e.target.value) {
					// input is not a number
					const newError = "Please enter a decimal number";
					setErrors(newError);
				}
			}, 1000)
		);
	};

	const changeInputTokens = (e) => {
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
				const pattern = /^(0|[1-9]\d*)(\.\d+)?$/;
				if (pattern.test(e.target.value)) {
					// check if input is a valid number

					const nbTokens = e.target.value;
					setDonationAmtEth(nbTokens);

					const priceInEth = nbTokens * tokenPrice;

					setDonationAmtUSD(priceInEth);
					setDonationAmtUSD(priceInEth * ethPrice);

					// calculate estimated fees
					// estimateFees();
				} else {
					// input is not a number
					const newErrorTokens = "Please enter a decimal number";
					console.log(newErrorTokens);
					// setErrorsInputTokens(newError);
				}
			}, 1000)
		);
	};

	const mintNFT1155 = () => {
		contractACHouse.createNFT1155(2, 1).then((f) => {
			console.log("after calling CreateNFT1155", f);
		});
	};

	const createMarketItem1155 = () => {
		//Since you used ACHouse1155 contract to create the Tokens, you should pass the address of the contract where the token resides (was created).
		// Same applies for NFT create outside of our system.
		// create1155MarketItem(address nftContract, uint256 tokenId, uint256 price, uint256 amount, uint256 _charityId, uint256 auctionTime, bool isFrac)
		contractACHouse
			.create1155MarketItem(
				contractACHouse1155.address,
				1,
				1,
				1,
				1,
				1634309818,
				false
			) // false for isFrac
			.then((f) => {
				console.log("after create 1155 MarketItem", f);
			});
	};

	const createMarketItem1155Frac = () => {
		//Since you used ACHouse1155 contract to create the Tokens, you should pass the address of the contract where the token resides (was created).
		// Same applies for NFT create outside of our system.
		// create1155MarketItem(address nftContract, uint256 tokenId, uint256 price, uint256 amount, uint256 _charityId, uint256 auctionTime, bool isFrac)
		contractACHouse
			.create1155MarketItem(
				contractACHouse1155.address,
				1,
				2,
				50,
				1,
				1634309818,
				true
			) // false for isFrac
			.then((f) => {
				console.log("after create 1155 MarketItem", f);
			});
	};

	const fractionalizeMarketItem1155 = () => {
		// fractionalize1155NFT(address nftContract, uint256 tokenId, uint256 shardId, uint256 supplyToCreate, string memory uri) => uint256
		contractACHouse
			.fractionalize1155NFT(
				contractACHouse1155.address,
				2,
				1,
				200,
				"ipfs://bafyreih76tru7mgvpjqszqfjnipbqf5hbit2x37cddpu57slid7kwkeyxy/metadata.json"
			)
			.then((f) => {
				console.log("fractionalize1155NFT", f);
			});
	};

	const createNGO = () => {
		const addr = "0xbAF4F56323F3b57b4a1E1191ac62F19b7Fd549C4";
		const name = "ABC";

		// contractACHouse
		// 	.addCharity(addr, name)
		// 	.then((f) => {
		// 	console.log("add charity", f);
		// });
	};

	const set721ParentApproval = () => {
		contractACHouse721.setParentApproval().then((f) => {
			console.log("parent address", f);
		});
	};

	// const createMarketSale = async () => {
	// 	const ganacheUrl = "http://127.0.0.1:7545";
	// 	let provider = new providers.JsonRpcProvider(ganacheUrl);

	// 	let overrides = {
	// 		value: ethers.utils.parseEther("2"),
	// 	};
	// 	let tx = await contractACHouseBuyer
	// 		.createMarketSale(contractACHouse1155.address, 2, overrides);

	// 	// await accountTwoSigner.getBalance().then((f) => {
	// 	// 	console.log("Balance: ", ethers.utils.formatUnits(f.toString(), "ether"));
	// 	// });
	// 	// contractACHouse.createMarketSale(contractACHouse1155.address, 1)
	// 	// .then((f) => {
	// 	// 	console.log("create", f);
	// 	// });;
	// };

	async function createMarketSale() {
		let overrides = {
			value: ethers.utils.parseEther(".000000000000000002"),
		};
		// console.log(ethers.utils.parseEther("2"));
		// console.log(ethers.utils.parseEther("2000000000000000000"));
		// console.log(ethers.utils.parseEther(".000000000000000002"));

		let tx = await contractACHouseBuyer.createMarketSale(
			contractACHouse1155.address,
			2,
			overrides
		);

		console.log("tx", tx);
	}

	const mintingNFTs = () => {
		console.log("Calling MintNFT1155");
		// mintNFT1155();
		// setParentApproval();
		// createMarketItem1155();
		// fractionalizeMarketItem1155();
		// createMarketItem1155Frac(); // for fractional token. update with frac id

		// getFractionalInformation(1);
		// createMarketSale();

		// ERC1155 functions
		// getTokenURI(1);

		// getTokenCount();

		// getTokenIds();

		// getTokenSupply(1);

		// ERC721 functions
		// mintNFT721();

		// set721ParentApproval();

		// get721TokenCount();

		// get721TokenIds();

		// get721TokenName(1);

		// get721TokenSymbol(1);

		// get721TokenURI(1);

		// console.log(ethers.utils.formatEther( 0x0a ))

		fetchUnSoldMarketItems();

		fetchMyNFTs();

		fetchItemsCreated();

		// fetchMarketItem(1);

		// createNGO();
		// contractACHouse
		// 	.getCharityInfo(1)
		// 	.then((f) => {
		// 	console.log("get charity", f);
		// }); // get charity "ABC"

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
	/******************************ERC721 FUNCTIONALITY********************** */
	async function mintNFT721() {
		contractACHouse.createNFT721(1, "", "STONFT", "STO").then((f) => {
			console.log("after calling CreateNFT721", f);
		});
	}

	// get total number of tokens.
	async function get721TokenCount() {
		let data = await contractACHouse.get721TokenCount().then((f) => {
			console.log("721Token Count: ", f.toNumber());
			return f.toNumber();
		});
	}

	async function get721TokenIds() {
		let data = await contractACHouse.get721TokenIds().then((f) => {
			console.log("721Token Ids", f);
			return f;
		});
		console.log("data = ", data);
		const tokenIds = await Promise.all(
			data.map(async (i) => {
				// console.log("i = ", i);
				return i.toNumber();
			})
		);
		console.log("721tokenIds: ", tokenIds);
	}

	async function get721TokenName(id) {
		let data = await contractACHouse.get721TokenName(id).then((f) => {
			console.log("Token Name for id", f);
			return f;
		});
	}

	async function get721TokenSymbol(id) {
		let data = await contractACHouse.get721TokenSymbol(id).then((f) => {
			console.log("Token Symbol for id", f);
			return f;
		});
	}

	async function get721TokenURI(id) {
		let data = await contractACHouse.get721TokenURI(id).then((f) => {
			console.log("721Token URI: ", f);
			// if string then f.toString();
			return f;
		});
	}

	/******************************ERC1155 FUNCTIONALITY********************** */
	async function getTokenURI(id) {
		let data = await contractACHouse.getTokenURI(id).then((f) => {
			console.log("Token URI: ", f);
			// if string then f.toString();
			return f;
		});
	}

	// get total number of tokens.
	async function getTokenCount() {
		let data = await contractACHouse.getTokenCount().then((f) => {
			console.log("Token Count: ", f.toNumber());
			return f.toNumber();
		});
	}

	async function getTokenIds() {
		let data = await contractACHouse.getTokenIds().then((f) => {
			console.log("Token Ids", f);
			return f;
		});
		console.log("data = ", data);
		const tokenIds = await Promise.all(
			data.map(async (i) => {
				console.log("i = ", i);
				return i.toNumber();
			})
		);
		console.log("tokenIds: ", tokenIds);
	}

	async function getTokenSupply(id) {
		let data = await contractACHouse.getTokenSupply(id).then((f) => {
			console.log("Token Supply for id", f.toNumber());
			return f.toNumber();
		});
	}

	/******************************MARKET PLACE FUNCTIONALITY********************** */
	async function fetchMarketItem(id) {
		let data = [];
		await contractACHouse.fetchMarketItem(id).then((f) => {
			console.log("Fetch marketItem by Id", f);
			data.push(f);
		});

		console.log("data: ", data);

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
	}

	async function fetchUnSoldMarketItems() {
		let data = await contractACHouse.fetchUnSoldMarketItems().then((f) => {
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
	}

	async function fetchMyNFTs() {
		let data = await contractACHouseBuyer.fetchMyNFTs().then((f) => {
			// console.log("Fetch NFT created by user", f);
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
	}

	async function fetchItemsCreated() {
		let data = await contractACHouse.fetchItemsCreated().then((f) => {
			// console.log("Fetch Items created by user", f);
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
	}

	/******************************MARKET PLACE FUNCTIONALITY********************** */
	async function getFractionalInformation(id) {
		let data = [];
		await contractACHouse.getFractionalInformation(id).then((f) => {
			console.log("get FractionalINfo by Id", f);
			data.push(f);
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
					fractionalContract: i.fractionalContract,
					shardId: i.shardId.toNumber(),
					supplyMinted: i.supplyMinted.toNumber(),
					supplyRemaining: i.supplyRemaining.toNumber(),
					isMultiToken: i.isMultiToken,
				};
				return item;
			})
		);
		console.log("items: ", items);
	}

	const estimateFees = async () => {
		// function to calculate estimated fees

		const gasPrice = await provider.getGasPrice();
		console.log("Big number: ", gasPrice);

		const gasPriceGwei = utils.formatUnits(gasPrice, "gwei");
		console.log("gas price in gwei: ", gasPriceGwei);

		// const gasPriceGwei = utils.formatUnits(gasPrice, "gwei");
		// console.log("gas price in gwei: ", gasPriceGwei);

		// let gasUnitsEstimated = await contractACHouse.estimateGas.createMarketSale(contractACHouse1155.address, 1, overrides);
		// console.log('gasEstimate', parseInt(gasUnitsEstimated, 10));

		// const gasPrice = await provider.getGasPrice();
		// console.log("Big number: ", gasPrice.toString());

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
								{donationAmtUSD ? <span> ({donationAmtUSD} USD)</span> : ""}
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
								<div className="alert alert-error my-2">
									<div className="flex-1">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											className="w-6 h-6 mx-2 stroke-current"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
											></path>
										</svg>
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
								value={donationAmtTokens ? donationAmtTokens : ""}
								className="input input-primary input-bordered"
								inputMode="decimal"
								pattern="^\d*[.,]?\d*$"
								onChange={changeInputTokens}
							/>
						</div>
						<div className="py-2">
							<p>
								Remaining nb of tokens:
								<span className="font-bold h-6 mt-3 text-gray-600 leading-8 uppercase">
									{" "}
									{tokenSupply} {tokenSymbol}
								</span>
							</p>
						</div>
						<div className="py-2">
							<p>
								Estimate ETH price of 1 {tokenSymbol}:{" "}
								<span className="font-bold h-6 mt-3 text-gray-600 leading-8 uppercase">
									{tokenPrice} ETH
								</span>
							</p>
						</div>
						<div className="py-2">
							<p>
								Estimated fees:{" "}
								<span className="font-bold h-6 mt-3 text-gray-600 leading-8 uppercase">
									{gasFeesETH} ETH / {gasFeesUSD}$
								</span>
							</p>
						</div>
						<div className="py-2">
							{donationAmtTokens ? (
								<p>
									Min. received:{" "}
									<span className="font-bold h-6 mt-3 text-gray-600 leading-8 uppercase">
										{donationAmtTokens} {tokenSymbol}
									</span>
								</p>
							) : (
								<span>Min. received: -</span>
							)}
						</div>
						<div className="py-2">
							<span>
								Donation amount to charity:{" "}
								{donationAmtEth && donationAmtUSD ? (
									<span className="font-bold h-6 mt-3 text-gray-600 leading-8 uppercase">
										{donationAmtEth} ETH - {donationAmtUSD} $
									</span>
								) : (
									<span className="font-bold h-6 mt-3 text-gray-600 leading-8 uppercase">
										-
									</span>
								)}
							</span>
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
									<p>
										$ {donationAmtUSD} / {donationAmtEth}ETH
									</p>
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
