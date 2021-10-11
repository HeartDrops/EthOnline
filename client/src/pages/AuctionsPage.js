import React, { useEffect, useState } from "react";
import ShowcaseAuctions from "../components/showcaseAuctions";
import { ethers, Signer, providers, BigNumber, utils } from "ethers";
import ACHouseContract from "../contracts/ACHouse.json";
import ACHouseToken721Contract from "../contracts/ACHouseToken721.json";
import ACHouseToken1155Contract from "../contracts/ACHouseToken1155.json";

const AuctionsPage = () => {
	const [ACHouse, setACHouse] = useState(null);
	const [ACHouse1155, setACHouse1155] = useState(null);
	const [ACHouse721, setACHouse721] = useState(null);
	const [listItems, setListItems] = useState(null);
	const [tokenIdsList1155, setTokenIdsList1155] = useState(null);
	const [tokenIdsList721, setTokenIdsList721] = useState(null);

	// setting global var for ACHousContract.
	let contractACHouse,
		contractACHouse1155,
		contractACHouse721 = null;

	const rpcConnection = async () => {
		const ganacheUrl = "http://127.0.0.1:7545";
		let provider = new providers.JsonRpcProvider(ganacheUrl);
		console.log("provider: ", provider);

		let chainId = await provider.getNetwork();
		console.log("chainId: ", chainId);

		let networkId = await window.ethereum.request({
			method: "net_version",
		});
		console.log("networkId: " + networkId);

		let providerAccounts = await provider.listAccounts();
		console.log("providerAccts: ", providerAccounts);

		const accountOne = providerAccounts[1]; // ganache account at index 1
		const accountTwo = providerAccounts[2]; // ganache account at index 2

		console.log("accountOne: " + accountOne + ", accountTwo: " + accountTwo);

		/******************************************************************************* */
		// This is the only thing i have to hard code. The 5777 value i am not able to find it through ether.js.. so for now this will get you the address regardless
		// of migrations.
		// const ACHouseAddress = ACHouseContract.networks[5777].address;
		// const ACHouse1155Address = ACHouseToken1155Contract.networks[5777].address;
		// const ACHouse721Address = ACHouseToken721Contract.networks[5777].address
		const ACHouseAddress = "0xB1C3dFbc7A5f348004E0f6fBE44061fd58177A79";
		const ACHouse1155Address = "0x7c03758Fd6710fa5c2260b08713b38ab8bE91b4e";
		const ACHouse721Address = "0x3261225BDfBb1546BB28202007B893966b6a21Be";
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
	}

	useEffect(() => {
		if (ACHouse && listItems == null) {
			fetchUnSoldMarketItems();
			// fetchItemsCreated();
		}
	}, [fetchUnSoldMarketItems]);

	async function fetchItemsCreated() {
		let data = await ACHouse.fetchItemsCreated().then((f) => {
			console.log("Fetch Items created by user", f);
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
				};
				return item;
			})
		);
		// console.log("items: ", items);
	}

	async function fetchUnSoldMarketItems() {
		let data = await ACHouse.fetchUnSoldMarketItems().then((f) => {
			console.log("unsold market items", f);
			return f;
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
		setListItems(items);
	}

	// ------------ functions for testing purposes ------------------

	const setParentApproval = () => {
		ACHouse1155.setParentApproval().then((f) => {
			console.log("parent address", f);
		});
	};

	const mintNFT1155 = () => {
		ACHouse.createNFT1155(2, 1).then((f) => {
			console.log("after calling CreateNFT1155", f);
		});
	};

	const createMarketItem1155Frac = () => {
		//Since you used ACHouse1155 contract to create the Tokens, you should pass the address of the contract where the token resides (was created).
		// Same applies for NFT create outside of our system.
		// create1155MarketItem(address nftContract, uint256 tokenId, uint256 price, uint256 amount, uint256 _charityId, uint256 auctionTime, bool isFrac)

		//convert the price to wei
		let price = 2.25;
		let strPrice = price.toString();
		let priceInWei = ethers.utils.parseUnits(strPrice, 18);

		console.log("priceInWei: ", priceInWei);

		ACHouse.create1155MarketItem(
			ACHouse1155.address,
			1,
			priceInWei,
			50,
			1,
			1634309818,
			true
		) // false for isFrac
			.then((f) => {
				console.log("after create 1155 MarketItem", f);
			});
	};

	const showState = () => {
		console.log("state: ", listItems);
		console.log("state tokens1155", tokenIdsList1155);
		console.log("state tokens721", tokenIdsList721);
	};

	const fractionalizeMarketItem1155 = () => {
		// fractionalize1155NFT(address nftContract, uint256 tokenId, uint256 shardId, uint256 supplyToCreate, string memory uri) => uint256
		ACHouse.fractionalize1155NFT(
			ACHouse1155.address,
			2,
			1,
			200,
			"ipfs://bafyreih76tru7mgvpjqszqfjnipbqf5hbit2x37cddpu57slid7kwkeyxy/metadata.json"
		).then((f) => {
			console.log("fractionalize1155NFT", f);
		});
	};

	async function getFractionalInformation(id) {
		id = 2;
		let data = [];
		await ACHouse.getFractionalInformation(id).then((f) => {
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

	// ------ For ERC 1155 -------

	async function getTokenIds1155() {
		let data = await ACHouse.getTokenIds().then((f) => {
			// console.log("Token Ids", f);
			return f;
		});
		// console.log("data = ", data);
		const tokenIds = await Promise.all(
			data.map(async (i) => {
				// console.log("i = ", i);
				return i.toNumber();
			})
		);
		// console.log("tokenIds: ", tokenIds);
		setTokenIdsList1155(tokenIds);
	}

	// ------ For ERC 721 -------
	// get total number of tokens.
	async function get721TokenCount() {
		let data = await contractACHouse.get721TokenCount().then((f) => {
			console.log("721Token Count: ", f.toNumber());
			return f.toNumber();
		});
	}

	async function getTokenIds721() {
		let data = await ACHouse.get721TokenIds().then((f) => {
			// console.log("721Token Ids", f);
			return f;
		});
		// console.log("data721 = ", data);
		if (data.length > 0) {
			const tokenIds = await Promise.all(
				data.map(async (i) => {
					// console.log("i = ", i);
					return i.toNumber();
				})
			);
			// console.log("721tokenIds: ", tokenIds);
			setTokenIdsList721(tokenIds);
		} else {
			setTokenIdsList721([]);
		}
	}

	async function get721TokenName(id) {
		let data = await ACHouse.get721TokenName(id).then((f) => {
			console.log("Token Name for id", f);
			return f;
		});
	}

	async function get721TokenSymbol(id) {
		let data = await ACHouse.get721TokenSymbol(id).then((f) => {
			console.log("Token Symbol for id", f);
			return f;
		});
	}

	async function get721TokenURI(id) {
		let data = await ACHouse.get721TokenURI(id).then((f) => {
			console.log("721Token URI: ", f);
			// if string then f.toString();
			return f;
		});
	}

	// ------------ end block of functions for testing purposes ------------------

	return (
		<>
			<h2 className="title text-4xl mb-8 my-10 mx-auto text-center font-bold text-purple-700">
				Current Heart Drops
			</h2>
			{/* <div>
				<button className="btn btn-primary btn-wide mx-2" onClick={mintNFT1155}>
					1.Create NFT 1155
				</button>
				<button
					className="btn btn-primary btn-wide mx-2"
					onClick={setParentApproval}
				>
					2.Set Parent Approval
				</button>
				<button
					className="btn btn-primary btn-wide mx-2"
					onClick={fractionalizeMarketItem1155}
				>
					3.Fractionalize 1155
				</button>
				<button
					className="btn btn-primary btn-wide mx-2"
					onClick={createMarketItem1155Frac}
				>
					4.Create Market Item 1155
				</button>
				<button
					className="btn btn-primary btn-wide mx-2"
					onClick={fetchUnSoldMarketItems}
				>
					Fetch items created
				</button>
				<button className="btn btn-primary btn-wide mx-2" onClick={showState}>
					Show State
				</button>
			</div> */}
			<div className="py-5">
				<div className="container mx-auto p-5">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 lg:gap-20">
						{listItems && listItems.length > 0
							? listItems.map((item) => (
									<ShowcaseAuctions
										key={item.id}
										item={item}
										ACHouse={ACHouse}
									/>
							  ))
							: ""}
					</div>
				</div>
			</div>
		</>
	);
};

export default AuctionsPage;
