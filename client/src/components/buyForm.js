import React, { useState, useEffect } from 'react';
import Connect from './connect';
import { ethers, Signer, providers, BigNumber, utils } from 'ethers';

import ACHouseContract from '../contracts/ACHouse.json';
import ACHouseToken721Contract from '../contracts/ACHouseToken721.json';
import ACHouseToken1155Contract from '../contracts/ACHouseToken1155.json';

const BuyForm = () => {
	const [connected, setConnected] = useState(false);
	const [balance, setBalance] = useState(0);
	const [errors, setErrors] = useState(null);
	const [timer, setTimer] = useState(null);

    // setStep to change page
    const [step, setStep] = useState(0);

    // info on auction selected
    const [charityID, setCharityID] = useState(null);
    const [balanceFloor, setBalanceFloor] = useState(200);    // nb of tokens restants

    const [donation, setDonation] = useState(0); // donation in ETH
    // nb of tokens received for a given amount of eth
    const [minReceivedToken, setMinReceivedTokens] = useState(0);
    // amount given to the charity
    const [donationAmount, setDonationAmount] = useState(0);
    // fees calculated depending of current gas fees 
    const [gasFeesETH, setGasFeesETH] = useState(0);
    const [gasFeesDollars, setGasFeesDollars] = useState(0);

    const [valueTokens, setValueTokens] = useState(null);



    // tx information
    const [transactionSucceeded, setTransactionSucceeded] = useState(null);



    // CONTRACTS INFORMATION
    const ganacheUrl = "http://127.0.0.1:7545"

    let abi = JSON.parse(JSON.stringify(ACHouseContract.abi));
    let abi1155 = JSON.parse(JSON.stringify(ACHouseToken1155Contract.abi));
    // console.log('abi:', ACHouseContract);

    const varNetwork = ACHouseContract.networks;
    const ACHouseAddress = varNetwork.address;
    console.log(ACHouseAddress);

    // let provider = new ethers.providers.Web3Provider(window.ethereum);
    let provider = new providers.JsonRpcProvider(ganacheUrl);
    console.log('provider: ', provider);

    const signer = provider.getSigner('0x8D36Ff81065D054a9F3495Ec680CC4720b1c0b10');
    console.log('signer: ', signer._address);



    const selectNextHandler = () => {
        if (step < 2) {
          setStep((prevActiveStep) => prevActiveStep + 1);
          console.log('next');
        } else {
          console.log('no');
        }
      };
    
    const selectPrevHandler = () => {
        if (step > 0 ) {
          setStep((prevActiveStep) => prevActiveStep - 1);
          console.log('next');
        } else {
          console.log('no');
        }
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
        getNFTDataTest();
	});

	const changeInputETH = (e) => {
		setErrors(null);
		setValueTokens(null);

		if (timer) {
			clearTimeout(timer);
			setTimer(null);
		}
		setTimer(
			setTimeout(() => {
				// console.log('input has changed');
				// console.log('value entered : ', e.target.value);

				// Check if input is a number
				const pattern = /^(0|[1-9]\d*)(\.\d+)?$/; // check if number
				const ETHamount = e.target.value;

				if (pattern.test(ETHamount)) {
					// input is a number
					// console.log('c 1 un nombre');

                    setDonation(ETHamount);
                    
                    getNbOfTokens(ETHamount);

					// check that amount is covered by wallet of user ?
					//if (balance > 0 && ETHamount > balance) {
						// console.log('oops you don\' have enough in your wallet');
						//const newError = "Oops ! You don' have enough in your wallet";
						//setErrors(newError);

						// mais calculer quand même combien ça vaut
					//} else {
						// console.log('you have enough in your wallet');

						// setValueTokens("new amount of tokens");

						// calculate estimated fees
						// check wallet has enough

						// calculate implied valuation
						// calculate donation amount to charity
					//}
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

        let contractAChouse= new ethers.Contract('0x786b07E6368f4086cF732d8057a0281DB90EFefB', abi, signer);

        contractAChouse.createNFT1155(1, 1).then((f) => {
            console.log(f);
          });

    };

    const createMarketItem1155 = () => {

        let contractACHouse = new ethers.Contract('0x786b07E6368f4086cF732d8057a0281DB90EFefB', abi, signer);
        console.log("contractACHouse:", contractACHouse);

        contractACHouse.create1155MarketItem(contractAChouse.address, 1, 10, 200).then((f) => {
            console.log(f);
        });

    };

    const getNbOfTokens = (amount) => {
        
        // mintNFT1155();
        createMarketItem1155();  
        
        // estimateFees();
        

        // let contractAChouse = new ethers.Contract('0x786b07E6368f4086cF732d8057a0281DB90EFefB', abi, provider);
        // let contractAChouse1155 = new ethers.Contract('0x72BcC182029a4096CA03BEA1aC403761fD78092e', abi1155, provider);
        // console.log("contract:", contractAChouse);

        // contractAChouse.fetchUnSoldMarketItems().then((f) => {
        //     console.log(f);
        //   });


    };
    const getNFTDataTest = () => { // take _NFTname as identifiers
        // let provider = ethers.getDefaultProvider();
        // console.log('provider: ', provider);
        // let contract = new ethers.Contract('0x786b07E6368f4086cF732d8057a0281DB90EFefB', abi, provider);
        // console.log(contract);

        // var callPromise = contract.getNFTData;
        // console.log('callPromise: ', callPromise);
        
    };

    // getfracNftData

    const estimateFees = async () => {
        // function to calculate estimated fees based 

        const gasPrice = await provider.getGasPrice();
        console.log('Big number: ', gasPrice);

        const gasPriceGwei = utils.formatUnits(gasPrice, "gwei");
        console.log('gas price in gwei: ', gasPriceGwei);

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
		setTransactionSucceeded(true);
	};

    const handleTransaction = () => {

        // connect to smart contract to handle transaction

    };

	return (
        <>
        {step==0 &&
            <>
            <form className="" onSubmit={handleSubmit}>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Pay</span>
                        <span>Balance: {balance} ETH</span>
                    </label>
                    <div>
                        <input
                            type="text"
                            placeholder="0.0"
                            className="input input-primary input-bordered"
                            required
                            inputMode="decimal"
                            pattern="^\d*[.,]?\d*$"
                            onChange={changeInputETH}
                        />
                        <span className=""> ETH</span>
                    </div>
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
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Receive</span>
                        <span>Balance floor: {balanceFloor} tokens</span>
                    </label>
                    <div className="input-primary input-bordered">
                        <input
                            type="text"
                            placeholder="0.0"
                            value={valueTokens || ""}
                            className="input input-primary input-bordered"
                            disabled="disabled"
                            inputMode="decimal"
                        />
                        <span className=""> $TOKENS</span>
                    </div>
                </div>
                <div className="py-2">
                    <span>Estimated fees: {gasFeesETH} ETH / {gasFeesDollars}$</span>
                </div>
                <div className="py-2">
                    <span>Min. received: X$</span>
                </div>
                <div className="py-2">
                    <span>Implied valuation: X$</span>
                </div>
                <div className="py-2">
                    <span>Donation amount to charity: X$</span>
                </div>
                <div className="center-cnt py-2">
                    {connected ? (
                        <button className="btn btn-secondary btn-wide">Donate</button>
                    ) : (
                        <Connect />
                    )}
                </div>
            </form>
            </>
        }
        {step==1 && 
            <>
            <div class=" my-20 flex items-center justify-center">
                <div class="max-w-4xl  bg-white rounded-lg shadow-xl">
                    <div class="p-4 border-b">
                        <h2 class="text-2xl ">
                            Please confirm that your information is valid
                        </h2>
                        <p class="text-sm text-gray-500">
                            Personal details and application. 
                        </p>
                    </div>
                    <div>
                        <div class="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                            <p class="text-gray-600">
                                Preferred Name
                            </p>
                            <p>
                                Jane Doe
                            </p>
                        </div>
                        <div class="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                            <p class="text-gray-600">
                                NFT URI
                            </p>
                            <p>
                                Insert URI
                            </p>
                        </div>
                        <div class="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                            <p class="text-gray-600">
                                Discord Handle
                            </p>
                            <p>
                                sendmeat#5744
                            </p>
                        </div>
                        <div class="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                            <p class="text-gray-600">
                                To be raised
                            </p>
                            <p>
                                $ 12000 / 3ETH
                            </p>
                        </div>
                        <div class="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                            <p class="text-gray-600">
                                Token supply
                            </p>
                            <p>
                            200
                            </p>
                        </div>
                        <div class="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                            <p class="text-gray-600">
                                Token symbol
                            </p>
                            <p>
                            $PUNK
                            </p>
                        </div>
                        <div class="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                            <p class="text-gray-600">
                            Timeline
                            </p>
                            <p>
                            True
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="center-cnt py-2">
                <button className="btn btn-secondary btn-wide mx-2" onClick="selectPrevHandler">Previous</button>
                <button className="btn btn-primary btn-wide mx-2" onClick="handleTransaction">Validate transaction</button>
            </div>
            </>
        }
        {step==2 &&
            <>
                <div>
                {!transactionSucceeded ? (<div>transaction failed</div>) : (
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
        }
		</>
	);
};

export default BuyForm;
