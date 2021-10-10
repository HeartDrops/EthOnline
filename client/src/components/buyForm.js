import React, { useState, useEffect } from "react";
import Connect from "./connect";
import { ethers, Signer, providers, BigNumber, utils } from "ethers";
import coinGecko from "../api/coinGecko";
import axios from 'axios';
import DB from '../db.json';
import Countdown from '../components/countdown';
import arrows from '../assets/arrows.png';

import ACHouseContract from "../contracts/ACHouse.json";
import ACHouseToken721Contract from "../contracts/ACHouseToken721.json";
import ACHouseToken1155Contract from "../contracts/ACHouseToken1155.json";

const BuyForm = (props) => {

	const data = props.props.items;

	// console.log('props buyer', data);

	const tokenId = data.tokenId;
	const [nftUri, setNftUri] = useState(null);
	const [nftMetadata, setNftMetadata] = useState(null);

	const [connected, setConnected] = useState(false);
	const [errors, setErrors] = useState(null);
	const [timer, setTimer] = useState(null);
	const [step, setStep] = useState(0); // setStep to change page
	const [input, setInput] = useState(1); // input activated - 1 for ETH, 0 for Tokens 
	const [ethPrice, setEthPrice] = useState(null);

	const [charityInfo, setCharityInfo] = useState({
        id: null,
        name: null,
        domain: null
    });

	const [artistInfo, setArtistInfo] = useState({
        id: null,
        name: null,
        bio: null,
		image: null
    });

	const [tokenSupply, setTokenSupply] = useState(null); // remaining amount of tokens
	const [validForm, setValidForm] = useState('');
	const [tokenPrice, setTokenPrice] = useState(null); // value of 1 token for a given marketitem
	const [tokenSymbol, setTokenSymbol] = useState(null);
	const [tokenName, setTokenName] = useState(null);
	const [donationAmtUSD, setDonationAmtUSD] = useState(null);
	const [donationAmtEth, setDonationAmtEth] = useState(0);
	const [donationAmtTokens, setDonationAmtTokens] = useState(null);
	const [deadlineAuction, setDeadlineAuction] = useState(false);
	const [minReceived, setMinReceived] = useState(null);
	const [minDonation, setMinDonation] = useState(null);
	// Gas fees
	const [gasFeesETH, setGasFeesETH] = useState(0);
	const [gasFeesUSD, setGasFeesUSD] = useState(0);
	// tx information
	const [txReceipt, setTxReceipt] = useState(null);
	const [transactionSucceeded, setTransactionSucceeded] = useState(null);

	const [fractInfo, setFractInfo] = useState(null);
	const [marketItemInfo, setMarketItemInfo] = useState(null); 
	
	const [balance, setBalance] = useState(0); 

	// setting global var for ACHousContract.
	let contractACHouse,
		contractACHouseBuyer,
		contractACHouse1155,
		contractACHouse721,
		contractACHouseProvider,
		accountOneSigner,
		accountTwoSigner = null;
	const [ ACHouse, setACHouse] = useState(null);
	const [ ACHouse1155, setACHouse1155 ] = useState(null);
	const [ ACHouse721, setACHouse721 ] = useState(null); 
	const [ ACHouseBuyer, setACHouseBuyer ] = useState(null); 

	// nb of tokens received for a given amount of eth
	// const [minReceivedToken, setMinReceivedTokens] = useState(0);

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

		setACHouse(contractACHouse);
		setACHouse1155(contractACHouse1155);
		setACHouse721(contractACHouse721);
		setACHouseBuyer(contractACHouseBuyer);

	};
	if (ACHouse == null && ACHouse1155 == null && ACHouse721 == null && ACHouseBuyer == null) {
		rpcConnection();
	}

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

	useEffect(() => {
		console.log('data', data);
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

		if (data.seller && artistInfo.id == null) {
			const artists = DB.artists;
			artists.map((i) => {
				console.log('i', i);
				if(i.address == data.seller) {
					setArtistInfo({
						id: i.id,
						name: i.name,
						image: i.profile,
						bio: i.bio,
					})
				}
			});
        };
		if (data.charityId && charityInfo.id == null) {
            setCharityInfo({
                id: data.charityId,
                name: DB.charities[data.charityId].name,
                domain: DB.charities[data.charityId].domain,
                description: DB.charities[data.charityId].description,
                long_description: DB.charities[data.charityId].long_description
            });
        };
		if (props.props.nft_supply) {
			setTokenSupply(props.props.nft_supply);
		} else {
			setTokenSupply(1);
		}
		if (tokenName == null) { // que pour 721
			if (!data.isMultiToken) {
				get721TokenName(tokenId);
			} else {
				setTokenName('Token Name');
			}
		}
		if (tokenSymbol == null) { // que pour 721
			if (!data.isMultiToken) {
				get721TokenSymbol(tokenId);
			} else {
				setTokenSymbol('$SYMBOL');
			}
		}
		if (data.auctionTime != 0) {
			setDeadlineAuction(true);
		} else {
			setDeadlineAuction(false);
		}
		if (data.price) {
			setTokenPrice(data.price);
		} else {
			setTokenPrice(0.015);
		}

	}, [charityInfo.id, tokenSupply, tokenName, deadlineAuction, tokenPrice]);

	if (ACHouse != null && marketItemInfo == null && tokenId != null) {
		fetchMarketItem(tokenId);
	}
	if ( ACHouse != null && tokenId != null && fractInfo == null && marketItemInfo != null) {
		if(marketItemInfo[0].isFrac) {
			getFractionalInformation(tokenId);
		}
	}
	if( ACHouse != null && tokenId != null && nftUri == null ) {
		if (data.isMultiToken) {
	 		getNftUri1155(tokenId);
		} else {
			get721TokenURI(tokenId);
		}
	}
	if (ACHouse != null && tokenId != null && nftUri != null && nftMetadata == null) {
		loadNFT();
	}

	async function loadNFT() {
		// console.log("https://ipfs.infura.io/ipfs/" + nftUri.slice(7));
		const meta = await axios.get("https://ipfs.infura.io/ipfs/" + nftUri.slice(7));
		const url = 'https://ipfs.io/ipfs/' + meta.data.image.slice(7);
		// console.log('meta', meta.data);
		// console.log('url', url);
		setNftMetadata({
			name: meta.data.name,
			description: meta.data.description,
			image: meta.data.image,
			url: url
		});
	};

	// ---- get info on token for 1155 -----
	async function getNftUri1155(id) {
		let data = await ACHouse.getTokenURI(id).then((f) => {
			// console.log("Token URI 1155: ", f);
			// if string then f.toString();
			setNftUri(f);
		});
	}; 

	// ---- get info on token for 721 -----
	async function get721TokenName(id) {
		let data = await ACHouse.get721TokenName(id).then((f) => {
			setTokenName(f);
		});
	}
	async function get721TokenSymbol(id) {
		let data = await ACHouse.get721TokenSymbol(id).then((f) => {
			setTokenSymbol(f);
		});
	}
	async function get721TokenURI(id) {
		let data = await ACHouse.get721TokenURI(id).then((f) => {
			// console.log("721Token URI: ", f);
			setNftUri(f);
		});
	}

	const selectNextHandler = () => {
		if (step < 2) {
			setStep((prevActiveStep) => prevActiveStep + 1);
			// console.log("next");
		} else {
			// console.log("no");
		}
	};

	const selectPrevHandler = () => {
		if (step > 0) {
			setStep((prevActiveStep) => prevActiveStep - 1);
			// console.log("next");
		} else {
			// console.log("no");
		}
	};

	const isInt = (value) => {
		var x = parseFloat(value);
		return !isNaN(value) && (x | 0) === x;
	  }

	const changeInputETH = (e) => {
		setErrors(null);
		setDonationAmtEth(null);
		setDonationAmtTokens(null);
		setDonationAmtUSD(null);
		setGasFeesETH(null);
		setGasFeesUSD(null);
		setMinReceived(null);
		setMinDonation(null);
		setValidForm('');

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

					const priceEnteredEth = e.target.value;
					setDonationAmtEth(priceEnteredEth);
					setDonationAmtUSD(priceEnteredEth * ethPrice);

					// get nb of tokens for given amount of eth
					const nbTokens = priceEnteredEth / tokenPrice;
					console.log('nb tokens', nbTokens);
					setDonationAmtTokens(nbTokens);

					if (priceEnteredEth < tokenPrice) {
						const newError = "The amount entered is to low. The price of 1 token is " + tokenPrice + " ETH";
						setErrors(newError);
						setValidForm('btn-disabled');
					} else if (fractInfo != null && fractInfo[0].supplyRemaining < nbTokens) {

						const newError = "Thanks for your generosity but there are only " + fractInfo[0].supplyRemaining + " " + tokenSymbol + " remaining. Please enter a lower number.";
						setErrors(newError);
						setValidForm('btn-disabled');
						
					} else if (data.isMultiToken && !isInt(nbTokens)) {

						const roundedTokens = Math.floor(nbTokens);
						const newPrice = roundedTokens * tokenPrice ;

						const newError = "You can only buy full tokens.";
						setErrors(newError);
						setValidForm('btn-disabled');

						setMinReceived(roundedTokens);
						setDonationAmtTokens(nbTokens); // or roundedTokens depending on what we want to show in input

						const priceEth = ethPrice * newPrice;
						setMinDonation({ eth: newPrice, usd: priceEth, token: roundedTokens });
					} else {
						setMinReceived(nbTokens);
					}
					// calculate estimated fees
					estimateFees();
				} else if (e.target.value) {
					// input is not a number
					const newError = "Please enter a decimal number";
					setErrors(newError);
					setValidForm('btn-disabled');
				}
			}, 1000)
		);
	};

	const changeInputTokens = (e) => {
		setErrors(null);
		setDonationAmtEth(null);
		setDonationAmtTokens(null);
		setDonationAmtUSD(null);
		setGasFeesETH(null);
		setGasFeesUSD(null);
		setMinReceived(null);
		setMinDonation(null);
		setValidForm('');

		if (timer) {
			clearTimeout(timer);
			setTimer(null);
		}
		setTimer(
			setTimeout(() => {
				const pattern = /^(0|[1-9]\d*)(\.\d+)?$/;
				if (pattern.test(e.target.value)) { // check if input is a valid number
					const nbTokens = e.target.value;

					if (data.isMultiToken && !isInt(nbTokens)) { // 1155 & input is not int
						const newError = "It's a 115. You need to enter an integer.";
						setErrors(newError);

					} else if (fractInfo != null && fractInfo[0].supplyRemaining < nbTokens) {
						// console.log('nbTokens', nbTokens);
						// console.log('fractInfo[0].supplyRemaining', fractInfo[0].supplyRemaining);

						const newError = "Thanks for your generosity but there are only " + fractInfo[0].supplyRemaining + " " + tokenSymbol + " remaining. Please enter a lower number.";
						setErrors(newError);
						setValidForm('btn-disabled');

					} else {
						setDonationAmtTokens(nbTokens);
						// console.log('nb tokens', nbTokens);

						const priceInEth = nbTokens * tokenPrice;
						// console.log('price in eth', priceInEth);
						// console.log('price in usd', priceInEth * ethPrice);
						setDonationAmtEth(priceInEth);
						setDonationAmtUSD(priceInEth * ethPrice);
						setMinReceived(nbTokens);

						estimateFees();

					}
				} else {
					// input is not a number
					const newError = "Please enter a decimal number";
					console.log(newError);
					setErrors(newError);
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
		const name = "XYZ";

		ACHouse.addCharity(addr, name).then((f) => {
			console.log("add charity", f);
		});
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
		console.log(ethers.utils.parseEther(".000000000000000002"));

		let tx = await ACHouseBuyer.createMarketSale(
			ACHouse1155.address,
			2,
			overrides
		);
		const receipt = await tx.wait();
		if (receipt) {
			setTransactionSucceeded(true);
		} else {
			setTransactionSucceeded(false);
		}
		console.log("tx", tx);
		console.log("receipt", receipt);
	}

	const mintingNFTs = () => {
		console.log("Calling MintNFT1155");
		// mintNFT1155();
		// setParentApproval();
		// createMarketItem1155();
		// fractionalizeMarketItem1155();
		// createMarketItem1155Frac(); // for fractional token. update with frac id

		getFractionalInformation(tokenId);
		// createMarketSale();

		// ERC1155 functions
		// getTokenURI(1);

		// getTokenCount();

		// getTokenIds();

		getTokenSupply(tokenId);

		// ERC721 functions
		// mintNFT721();

		// set721ParentApproval();

		// get721TokenCount();

		// get721TokenIds();

		// get721TokenName(1);

		// get721TokenSymbol(1);

		// get721TokenURI(1);

		// console.log(ethers.utils.formatEther( 0x0a ))

		// fetchUnSoldMarketItems();

		// fetchMyNFTs();

		// fetchItemsCreated();

		fetchMarketItem(tokenId);

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

	// async function get721TokenName(id) {
	// 	let data = await contractACHouse.get721TokenName(id).then((f) => {
	// 		console.log("Token Name for id", f);
	// 		return f;
	// 	});
	// }

	// async function get721TokenSymbol(id) {
	// 	let data = await contractACHouse.get721TokenSymbol(id).then((f) => {
	// 		console.log("Token Symbol for id", f);
	// 		return f;
	// 	});
	// }

	// async function get721TokenURI(id) {
	// 	let data = await contractACHouse.get721TokenURI(id).then((f) => {
	// 		console.log("721Token URI: ", f);
	// 		// if string then f.toString();
	// 		return f;
	// 	});
	// }

	/******************************ERC1155 FUNCTIONALITY********************** */
	// async function getTokenURI(id) {
	// 	console.log('id', id);
	// 	let data = await contractACHouse.getTokenURI(id).then((f) => {
	// 		console.log("Token URI: ", f);
	// 		// if string then f.toString();
	// 		return f;
	// 	});
	// }

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
		let data = await ACHouse.getTokenSupply(id).then((f) => {
			console.log("Token Supply for id", f.toNumber());
			return f.toNumber();
		});
	}

	/******************************MARKET PLACE FUNCTIONALITY********************** */
	async function fetchMarketItem(id) {
		let data = [];
		await ACHouse.fetchMarketItem(id).then((f) => {
			// console.log("Fetch marketItem by Id", f);
			data.push(f);
		});
		// console.log("data : ", data);

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
		setMarketItemInfo(items);
		// console.log("market item: ", items);
	}

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
	}

	async function fetchMyNFTs() {
		let data = await ACHouseBuyer.fetchMyNFTs().then((f) => {
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
		let data = await ACHouse.fetchItemsCreated().then((f) => {
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
		await ACHouse.getFractionalInformation(id).then((f) => {
			// console.log("get FractionalINfo by Id", f);
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
		// console.log("items fract: ", items);
		setFractInfo(items);
	}

	const estimateFees = async () => {
		const ganacheUrl = "http://127.0.0.1:7545";
		let provider = new providers.JsonRpcProvider(ganacheUrl);

		let tx = await provider.getGasPrice();

		// console.log("tx", ethers.utils.formatUnits(tx.toString(), "wei"));
		// console.log("tx", ethers.utils.formatUnits(tx.toString(), "gwei"));
		// console.log("tx", ethers.utils.formatUnits(tx.toString(), "ether"));

		const feesEth = ethers.utils.formatUnits(tx.toString(), "ether");
		const feesUSD = feesEth * ethPrice

		setGasFeesETH(feesEth);
		setGasFeesUSD(feesUSD.toFixed(6));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// console.log("form submitted");
		selectNextHandler();
	};

	const handleTransaction = () => {
		// connect to smart contract to handle transaction
		createMarketSale();
		selectNextHandler();


		// console.log(ethers.utils.parseEther(".000000000000000002"));
		// console.log(ethers.utils.parseEther("0.000000000000000002"));
		// console.log(donationAmtEth);
		// const price = 2;
		// let gwei = ethers.utils.formatUnits(price.toString(), "gwei");
		// let wei = ethers.utils.formatUnits(price.toString(), "wei");

		// let wei = ethers.utils.parseEther(price.toString());

		// console.log("tx", ethers.utils.formatUnits(tx.toString(), "wei"));
		// console.log("tx", ethers.utils.formatUnits(tx.toString(), "gwei"));
		// console.log("tx", ethers.utils.formatUnits(tx.toString(), "ether"));
		// test = (donationAmtEth + "").split(".");
		// console.log('test', wei);
	};

	const changeInput = (e) => {
		if (input == 1) {
			setInput(2);
		} else {
			setInput(1);
		}
		setErrors(null);
		setValidForm('');
	}

	return (
		<>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 lg:gap-20">
			<div className=" mb-0 relative ">
                <div className="card shadow-2xl">
                    <figure>
                        {/* <img src="https://picsum.photos/id/1005/400/250" className="shadow-lg" /> */}
						{nftMetadata && nftMetadata.image && <img src={nftMetadata.url} />}
                    </figure> 
                    <div className="card-body">
                        <h2 className="card-title uppercase font-bold">{nftMetadata && nftMetadata.name}</h2> 
                        <p className="mb-3"> created and donated by <span className="text-purple-700 font-bold uppercase">{artistInfo.name}</span></p> 
                        <p className="mb-3">{nftMetadata && nftMetadata.description}</p> 

						{/* <div className="avatar">
							<div className="mb-8 rounded-full w-24 h-24">
								<img src={artistInfo.image} />
							</div>
						</div>  */}

                        <div className="flex flex-wrap md:flex-nowrap justify-between my-3 cursor-pointer">
                            <div className="px-2 mb-4 lg:mb-0 flex-shrink-0">
                                <div className="uppercase text-xs text-gray-500 font-bold mb-2">Token Type</div>
                                {data.isMultiToken ? <div className="font-bold">ERC 1155</div> : <div className="font-bold">ERC 721</div>}
                            </div>
                            <div className="px-2 mb-4 lg:mb-0 flex-shrink-0">
                                <div className="uppercase text-xs text-gray-500 font-bold mb-2">Token Name</div>
                                <div className="font-bold">{tokenName}</div>
                            </div>
                            <div className="px-2 mb-4 lg:mb-0 flex-shrink-0">
                                <div className="uppercase text-xs text-gray-500 font-bold mb-2">Token Symbol</div>
                                <div className="font-bold">{tokenSymbol}</div>
                            </div>
                            <div className="px-2 mb-4 lg:mb-0 flex-shrink-0">
                                <div className="uppercase text-xs text-gray-500 font-bold mb-2">Total Supply</div>
                                {fractInfo && fractInfo.supplyMinted ? <div className="font-bold">{fractInfo.supplyMinted}</div> : data.isMultiToken ? <div className="font-bold">{tokenSupply}</div> : ""}
                            </div>
                        </div>
                    </div>
                </div>
				</div>
                <div className="">
                    <div className="card shadow-2xl p-7">
                        <div className=""> 
                            <div className="text-center mb-2">
                                <h2 className="card-title uppercase font-bold">Donate to {charityInfo.name}
                                    <div className="badge mx-2 badge-accent text-primary-content">ONGOING</div>
                                </h2>
                            </div> 
                        </div>
                        <div className="mb-5"> 
                            <p>{charityInfo.long_description}</p>
                        </div>

						{ step ==0 && (
							<>
								<div className="uppercase text-s font-bold mb-2 center-cnt">
									Time left to participate		
								</div>
								<div className="center-cnt mb-5">
									<Countdown end={data.auctionTime} />
								</div>
							</>
						)}

						{step == 0 && (
							<>
								<form className="" onSubmit={handleSubmit}>
									{input == 1 && (
										<>
											<div className="form-control">
												<label className="label font-bold h-6 mt-3 mb-1 text-gray-600 text-xs leading-8 uppercase">
													<span className="label-text">Pay <span className="badge badge-accent text-primary-content badge-sm">In ETH</span></span>
													{donationAmtUSD ? <span className="badge badge-outline badge-sm">$ {donationAmtUSD}</span> : ""}
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
											<div className="center-cnt mt-3">
												<img src={arrows} onClick={changeInput} />
											</div>
											<div className="form-control mb-5">
												<label className="label font-bold h-6 mt-3 text-gray-600 text-xs leading-8 uppercase mb-1">
													<span className="label-text">Receive <span className="badge badge-accent text-primary-content badge-sm">{tokenSymbol}</span></span>
												</label>
												<input
													type="text"
													placeholder="0.0"
													value={donationAmtTokens ? donationAmtTokens : ""}
													className="input input-primary input-bordered"
													inputMode="decimal"
													pattern="^\d*[.,]?\d*$"
													disabled ="disabled"
												/>
											</div>
										</>
									)}
									{input == 2 && (
										<>
											<div className="form-control">
												<label className="label font-bold h-6 mt-3 text-gray-600 text-xs leading-8 uppercase mb-1">
													<span className="label-text">Receive <span className="badge badge-accent text-primary-content badge-sm">{tokenSymbol}</span></span>
												</label>
												<input
													type="text"
													placeholder="0.0"
													className="input input-primary input-bordered"
													inputMode="decimal"
													pattern="^\d*[.,]?\d*$"
													onChange={changeInputTokens}
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
											<div className="center-cnt mt-3">
												<img src={arrows} onClick={changeInput} />
											</div>
											<div className="form-control mb-5">
												<label className="label font-bold h-6 mt-3 mb-1 text-gray-600 text-xs leading-8 uppercase">
													<span className="label-text">Pay <span className="badge badge-accent text-primary-content badge-sm">In ETH</span></span>
													{donationAmtUSD ? <span className="badge badge-outline badge-sm">$ {donationAmtUSD}</span> : ""}
													{/* <span>Balance user: {balance} ETH</span> */}
												</label>
												<input
													type="text"
													placeholder="0.0"
													className="input input-primary input-bordered"
													required
													inputMode="decimal"
													pattern="^\d*[.,]?\d*$"
													disabled ="disabled"
													value={donationAmtEth ? donationAmtEth : ""}
												/>
											</div>
										</>
									)}

									
									<div className="overflow-x-auto mb-5">
										<table className="table w-full table-zebra">
											<tbody>
												<tr>
													<td>Remaining number of tokens</td> 
													<th>
													<span className="font-bold h-6 mt-3 text-gray-600 leading-8 uppercase">
														{fractInfo && fractInfo.supplyRemaining ? fractInfo.supplyRemaining : tokenSupply} {tokenSymbol}
													</span>
													</th>
												</tr>
												<tr>
													<td>Price of 1 {tokenSymbol}
														{/* <span className="badge badge-outline badge-sm">In ETH</span> */}
													</td> 
													<th>
														<span className="font-bold h-6 mt-3 text-gray-600 leading-8 uppercase">
															{tokenPrice} ETH
														</span>
													</th>
												</tr>
												<tr>
													<td>Minimum received</td> 
													<th>
													{minReceived ? (
														<span className="font-bold h-6 mt-3 text-gray-600 leading-8 uppercase">
															{minReceived} {tokenSymbol}
														</span>
													) : (""
														// <span className="font-bold h-6 mt-3 text-gray-600 leading-8 uppercase">
														// 	-
														// </span>
													)}
													</th>
												</tr>
												<tr>
													<td>Estimated fees</td> 
													<th>
													{gasFeesETH && gasFeesUSD ? (
														<span className="font-bold h-6 mt-3 text-gray-600 leading-8 uppercase">
															{gasFeesETH} ETH {' '} <span className="badge badge-outline badge-sm">$ {gasFeesUSD}</span>
														</span>
													) : (""
													)}
													</th>
												</tr>
												<tr>
													<td>Donation amount to charity</td> 
													<th>
													{donationAmtEth && donationAmtUSD ? ( minReceived && minDonation ? 
														( <span className="font-bold h-6 mt-3 text-gray-600 leading-8 uppercase">
																{minDonation.eth} ETH {' '} <span className="badge badge-outline badge-sm">$ {minDonation.usd}</span>
															</span> )
															: (<span className="font-bold h-6 mt-3 text-gray-600 leading-8 uppercase">
																{donationAmtEth} ETH {' '} <span className="badge badge-outline badge-sm">$ {donationAmtUSD}</span>
															</span>
														) ) : ""
													}
													</th>
												</tr>
											</tbody> 
										</table>
										</div>
									<div className="center-cnt py-2">
										{!connected ? (
											<button className={`btn btn-secondary btn-wide text-primary-content ${validForm}`}>Donate</button>
										) : (
											<Connect />
										)}
									</div>
								</form>
							</>
						)}
						{step == 1 && (
							<>
								<div className=" my-5 flex items-center justify-center">
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
												<p className="text-gray-600">NFT</p>
												<p>{nftMetadata.name}</p>
											</div>
											<div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
												<p className="text-gray-600">Donation amount</p>
												<p>
													$ {donationAmtUSD} / {donationAmtEth}ETH
												</p>
											</div>
											<div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
												<p className="text-gray-600">To</p>
												<p>
													{charityInfo.name}
												</p>
											</div>
											<div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
												<p className="text-gray-600">Number of tokens purchased</p>
												<p>{donationAmtTokens} {tokenSymbol}</p>
											</div>
											<div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
												<p className="text-gray-600">Estimated fees </p>
												<p>{gasFeesETH} ETH / $ {gasFeesUSD}</p>
											</div>
										</div>
									</div>
								</div>
								<div className="center-cnt py-2">
									<button
										className="btn btn-secondary btn-wide mx-2 text-primary-content"
										onClick={selectPrevHandler}
									>
										Previous
									</button>
									<button
										className="btn btn-primary btn-wide mx-2 text-primary-content"
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
										<div>
											<div className="alert alert-warning">
												<div className="flex-1">
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 mx-2 stroke-current"> 
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>                         
													</svg> 
													<label>Oops ! Your transaction failed.</label>
												</div>
											</div>
										</div>
									) : (
										<div className="bg-primary shadow-lg rounded-3xl p-2">
											<div>
												<center><img className="mb-1" height="25" width="50" src="https://freight.cargo.site/t/thumbnail/w/100/i/7f7bbd305c0db77b741361e48b637588c0c47f141fcfb76be3e751b2adf3fff5/logo-heart-drops.svg" /></center>
											</div>
											<div className="py-3 text-center text-primary-content">
												Congratulations, your transaction was a success !
											</div>
											<div className="py-3 text-center text-primary-content">
												You now own {donationAmtTokens} {tokenSymbol}. You donated {donationAmtEth} ETH ($ {donationAmtUSD}) to {charityInfo.name}.
											</div>
											<div className="py-3 text-center text-primary-content">
												Thanks for supporting them !
											</div>
											<div className="center-cnt py-2">
												<button className="btn btn-accent btn-wide text-primary-content">Share</button>
											</div>
										</div>
									)}
								</div>
							</>
						)}
                    </div>
                </div>
            </div>
		</>
	);
};

export default BuyForm;
