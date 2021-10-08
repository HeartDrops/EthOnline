import React, { useEffect, useState } from 'react';
import FileUpload from './fileUpload';
import { NFTStorage, File, Blob  } from 'nft.storage';
import { ethers, Signer, providers, BigNumber, utils } from "ethers";
import coinGecko from '../api/coinGecko';

import imageToRender from '../assets/pepe.png';


import ACHouseContract from "../contracts/ACHouse.json";
import ACHouseToken721Contract from "../contracts/ACHouseToken721.json";
import ACHouseToken1155Contract from "../contracts/ACHouseToken1155.json";

const ACHouseAddress = "";

const ArtForm = () => {
  const [ userName, setUserName ] = useState('');
  const [ artName, setArtName ] = useState('');
  const [ artDesc, setArtDesc ] = useState('');
  const [ ethAddress, setEthAddress ] = useState('');
  const [ discord, setDiscord ] = useState('');
  const [ deadline, setDeadline ] = useState(false); 
  const [ isValid, setIsValid ] = useState({
    username: true,
    artname: true,
    ethadd: true
  });
  const [ ethPrice, setEthPrice ] = useState(null);

  // Token standard
  const [standard, setStandard] = useState(null);

  // If setStep to change page
  const [step, setStep] = useState(0);

  // File upload
  const [newFile, setNewFile] = useState({
    nftImage: []
  });
  const [img, setImg] = useState(null);

  const token = process.env.API_KEY;
  const endpoint = 'https://api.nft.storage';

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

  const updateUploadedFiles= (files) => {
    setNewFile({ ...newFile, nftImage: files })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(newFile);
    console.log(URL.createObjectURL(newFile.nftImage[0]));
    setImg(URL.createObjectURL(newFile.nftImage[0]));
  }

  const storeNFT = async () => {
    console.log('storing')
    const client = new NFTStorage({ token: token })
    const cid = await client.storeBlob(img)
    console.log('IPFS URL for the Blob:' + cid);
    // const metadata = await client.store({
    //   name: 'nft.storage store',
    //   description: 'ERC-1155 compatible metadata.',
    //   image: new Blob(img, 'pinpie.jpg', { type: 'image/jpg' }),
    // })
  }


  const erc721StandardHandler = () => {
    if (standard=="ERC721") {
      setStandard(null);
    } else {
      setStandard("ERC721");
    }
  };

  const erc1155StandardHandler = () => {
    if (standard=="ERC1155") {
      setStandard(null);
    } else {
      setStandard("ERC1155");
    }
  };

  const userNameChangeHandler = (e) => {
    const username = e.target.value;
    setUserName(username);
  }

  const artNameChangeHandler = (e) => {
    const artname = e.target.value;
    setArtName(artname);
  }


  const ethAddressChangeHandler = (e) => {
    const address = e.target.value.trim();
    setEthAddress(address);
  }

  const discordChangeHandler = (e) => {
    const discord = e.target.value;
    setDiscord(discord);
  }

  const artDescChangeHandler = (e) => {
    const artdesc = e.target.value;
    setArtDesc(artdesc);
  }

  const verifyFormData = () => {
    let userValid = false;
    let addrValid = false;
    let artValid = false;
    let descValid = false
    // username
    if (range(3,14,1).includes(userName.length)) {
      userValid = true;
    } 
    if (range(3,14,1).includes(artName.length)) {
      artValid = true;
    } 
    if (ethers.utils.isAddress(ethAddress)) {
      addrValid = true;
    } 
    if (artDesc.length > 0) {
      if (artDesc.match(/(\w+)/g).length < 26) {
        descValid = true;
      } else {
        descValid = false;
      }
    } else {
      descValid = true
    }
    return [userValid, addrValid, artValid, descValid];

  };

  const [ tokenSupply, setTokenSupply ] = useState(null);
  const [ validSupply, setValidSupply ] = useState(true);
  const [ tokenPrice, setTokenPrice ] = useState(null);
  const [ validPrice, setValidPrice ] = useState(true);
  const [ tokenSymbol, setTokenSymbol ] = useState(null);
  const [ amtUSD, setAmtUSD ] = useState(0);
  const [ amtEth, setAmtEth ] = useState(0)

  // Amount to raise


  const tokenSupplyHandler = (e) => {
    const tokensupply = +e.target.value;
    if (tokensupply > 10 ) {
      setTokenSupply(tokensupply);
      setValidSupply(true);
    } else {
      setValidSupply(false);
    }
  }

  
  const tokenPriceHandler = (e) => {
    const tokenprice = +e.target.value;
    if (tokenprice < 1 && tokenprice > 0) {
      setTokenPrice(tokenprice);
      setValidPrice(true);
    } else {
      setValidPrice(false);
    }
  }

  const tokenSymbolHandler = (e) => {
    const tokenSymbol = '$' + e.target.value.trim().toUpperCase();
    setTokenSymbol(tokenSymbol);
  }

  const deadlineHandler = () => {
    console.log(!deadline);
    setDeadline(!deadline);
  }

  // const generateAmtUSD = () => {
  //   const priceInEth = +tokenSupply * +tokenPrice;
  //   setAmtUSD(priceInEth * getEthPrice())
  // }

  useEffect(() => {
    const generateAmtUSD = () => {
      const priceInEth = +tokenSupply * +tokenPrice;
      setAmtEth(priceInEth);
      console.log(priceInEth);
      setAmtUSD(priceInEth * ethPrice)
    };
    console.log(isInt(tokenSupply))
    console.log(validPrice)
    console.log(ethPrice)
    if ( isInt(tokenSupply) && validPrice && ethPrice !=null) {
      generateAmtUSD();
    } else {
      console.log('ho')
    }
  }, [tokenPrice, tokenSupply]);

  // Helper functions

  const range = (start, stop, step) => {
    var a = [start], b = start;
    while (b < stop) {
        a.push(b += step || 1);
    }
    return a;
  }

  const isInt = (value) => {
    return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
  }

  const selectNextHandler = () => {
    console.log(step);
    console.log(standard);
    switch (step < 3) {
      case step==0 && standard!=null:
        setStep((prevActiveStep) => prevActiveStep + 1);
        break
      case step==1:
        const [userValid, addrValid, artValid, descValid] = verifyFormData();
        console.log(userValid);
        console.log(addrValid);
        console.log(artValid);
        setIsValid({
            username: userValid,
            artname: artValid,
            ethadd: addrValid,
          });  
        if (userValid && addrValid && artValid && descValid) {
          setStep((prevActiveStep) => prevActiveStep + 1);
        }
        break
      case step==2 && img!=null:
        setStep((prevActiveStep) => prevActiveStep + 1);
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

  // Smart Contract Caller functions

  const [ contractACHouse, setContractACHouse ] = useState(null);
  


 	// CONTRACTS INFORMATION
	// const ganacheUrl = "http://127.0.0.1:7545"

	// let abi = JSON.parse(JSON.stringify(ACHouseContract.abi));
	// let abi1155 = JSON.parse(JSON.stringify(ACHouseToken1155Contract.abi));
	// // console.log('abi:', ACHouseContract);

	// const varNetwork = ACHouseContract.networks;
	// const ACHouseAddress = varNetwork.address;
	// console.log(ACHouseAddress);

	// // let provider = new ethers.providers.Web3Provider(window.ethereum);
	// let provider = new providers.JsonRpcProvider(ganacheUrl);
	// console.log('provider: ', provider);

	// const signer = provider.getSigner('0x8D36Ff81065D054a9F3495Ec680CC4720b1c0b10');
	// console.log('signer: ', signer._address);


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
		console.log("contractACHouse", contractACHouse);

		// setContractACHouse(contractACHouse);
	};
	rpcConnection();






  const styles = {divClass: 'text-base hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer hover:bg-gray-200  bg-gray-100 text-gray-700 border duration-200 ease-in-out border-gray-600 transition',
                  textBorder: 'bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u'
                }

  return (
    <>
    <div className="p-5 my-20">
    <h2 className="title text-3xl mb-8 mx-auto text-center font-bold text-purple-700">Fractionalize</h2>
    <ul className="w-full steps">
      <li data-content={step==0 ? "?" : "✓"} className={step==0 ? "step" : "step step-info"}>Information</li> 
      <li data-content={step<1 ? "?" : "✓"} className={step<1 ? "step" : "step step-info"}>Details</li> 
      <li data-content={step<2 ? "?" : "✓"} className={step<2 ? "step" : "step step-info"}>Upload Image</li> 
      <li data-content={step<3 ? "?" : "✓"} className={step<3 ? "step" : "step step-info"}>Mint & Fractionalize</li>
    </ul>
    {step==0 &&
    <>
      <div className="card rounded-lg text-center shadow-2xl mx-40 my-20 py-10  md:text-xl">
        <h2 className="title text-3xl mb-8 my-10 mx-auto text-center font-bold text-purple-700">Select your NFT standard</h2>
            <div className="relative m-7 my-10 flex flex-wrap mx-auto justify-center">
            <div 
              className={standard=="ERC721" ? "0 2px 4px 0 rgba(255, 0, 0, 0.10) shadow-sm relative max-w-sm min-w-[340px] bg-white rounded-3xl p-2 mx-10 my-3 cursor-pointer": "0 35px 60px -15px rgba(0, 0, 0, 0.3) relative max-w-sm min-w-[340px] bg-white shadow-lg rounded-3xl p-2 mx-10 my-3 cursor-pointer motion-safe:hover:scale-105 transition duration-500 ease-in-out"}
              onClick={erc721StandardHandler}
            >
              <div className="overflow-x-hidden rounded-2xl relative">
                <img className="h-60 rounded-2xl w-full object-fill " src="https://ichef.bbci.co.uk/news/800/cpsprodpb/2692/production/_117547890_cd7706e1-1a9b-4e9e-9d55-7afe73c24984.jpg"/>
              </div>
              <div 
                className="mt-6 pl-2 mb-2 flex justify-center items-center"
                >
                <div>
                  <p className="items-center text-lg font-bold text-gray-900 mb-2">ERC721</p>
                </div>
              </div>
            </div>
            <div 
              className={standard=="ERC1155" ? "0 2px 4px 0 rgba(255, 0, 0, 0.10) shadow-sm relative max-w-sm min-w-[340px] bg-white rounded-3xl p-2 mx-10 my-3 cursor-pointer": "0 35px 60px -15px rgba(0, 0, 0, 0.3) relative max-w-sm min-w-[340px] bg-white shadow-lg rounded-3xl p-2 mx-10 my-3 cursor-pointer motion-safe:hover:scale-105 transition duration-500 ease-in-out"}
              onClick={erc1155StandardHandler}
              >
              <div className="overflow-x-hidden rounded-2xl relative ">
                <img className="h-60 rounded-2xl w-full object-fill" src="https://pixahive.com/wp-content/uploads/2020/10/Gym-shoes-153180-pixahive.jpg"/>
              </div>
              <div className="mt-6 pl-2 mb-2 flex justify-center items-center">
                <div>
                  <p className="items-center text-lg font-bold text-gray-900 mb-2">ERC1155</p>
                </div>
              </div>
            </div>
          </div> 
        </div>
        </>}

    {step==1 && 
          <div className="card shadow-2xl mx-40 my-20 py-20 px-10 h-full md:text-xl">
            <h2 className="title text-3xl mb-8 my-10 mx-auto text-center font-bold text-purple-700">Required Information</h2>
            <div className="flex flex-col md:flex-row">
                <div className="w-full flex-1 mx-2 svelte-1l8159u">
                <div className="font-bold h-6 mt-3 text-gray-600 text-xs leading-8 uppercase"> Preferred Name (*)</div>
                    <div className={`${styles.textBorder} ${!isValid.username ? 'border-red-500' : ''}`}>
                      <input 
                        placeholder="Beeple" 
                        className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                        onChange={userNameChangeHandler}
                        value={userName} 
                        /> 
                    </div>
                </div>
                <div className="w-full flex-1 mx-2 svelte-1l8159u">
                  <div className="font-bold h-6 mt-3 text-gray-600 text-xs leading-8 uppercase"> Name of Art Piece (*)</div>
                    <div className={`${styles.textBorder} ${!isValid.artname ? 'border-red-500' : ''}`}>
                      <input 
                        placeholder="Mona Lisa" 
                        className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                        onChange={artNameChangeHandler}
                        value={artName}
                        /> 
                    </div>
                </div>
              </div>
            <div className="flex flex-col md:flex-row">
                <div className="w-full mx-2 flex-1 svelte-1l8159u">
                    <div className="font-bold h-6 mt-3 text-gray-600 text-xs leading-8 uppercase"> Ethereum Address (*)</div>
                    <div className={`${styles.textBorder} ${!isValid.ethadd ? 'border-red-500' : ''}`}>
                        <input 
                          placeholder="0xb13...B25" 
                          className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                          onChange={ethAddressChangeHandler}
                          value={ethAddress}
                        /> </div>
                </div>
                <div className="w-full mx-2 flex-1 svelte-1l8159u">
                    <div className="font-bold h-6 mt-3 text-gray-600 text-xs leading-8 uppercase">Discord</div>
                    <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                      <input 
                        placeholder="sendmeat#5744" 
                        className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                        onChange={discordChangeHandler}
                        value={discord}
                      /> 
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row">
                <div className="w-full flex-1 mx-2 svelte-1l8159u">
                  <div className="font-bold h-6 mt-3 text-gray-600 text-xs leading-8 uppercase"> Description of Art Piece in 25 words</div>
                    <div className={`${styles.textBorder}`}>
                      <input 
                        placeholder="This fine art speaks volumes about the atrocities of men..." 
                        className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                        onChange={artDescChangeHandler}
                        value={artDesc}
                        /> 
                    </div>
                </div>
              </div>
        </div>
   }

  { step==2 && 
    <div class="card shadow-2xl mx-40 my-20 py-20 px-10 h-full md:text-xl">
      <h2 className="title text-3xl mb-8 my-10 mx-auto text-center font-bold text-purple-700">Upload your art piece</h2>
      <h3 className="title text-xl mb-8 my-2 mx-auto text-center text-purple-700">Supported files: JPG, PNG, JPEG, GIF</h3>
      <div class="m-7 my-20"> 
        <FileUpload 
        accept=".jpg,.png,.jpeg,.gif"
        label="NFT Image"
        multiple
        updateFilesCb={updateUploadedFiles}
      />
        <button className="text-base ml-2  hover:scale-110 hover:bg-purple-600 focus:shadow-outline focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
          hover:bg-teal-600  
          bg-purple-500 
          text-white 
          font-bold
          border duration-200 ease-in-out 
          border-teal-600 transition"
          onClick={handleSubmit}
          >Submit</button>
        {img && <button className="text-base ml-2  hover:scale-110 hover:bg-purple-600 focus:shadow-outline focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
          hover:bg-teal-600  
          bg-purple-500 
          text-white 
          font-bold
          border duration-200 ease-in-out 
          border-teal-600 transition"
          onClick={storeNFT}
        >Store</button>}
      </div>
    </div>
      }
      { step==3 && 
        <div className="card shadow-2xl mx-40 my-20 py-20 px-10 h-full md:text-xl items-center">
        <h2 className="title text-3xl mb-8 mx-auto text-center font-bold text-purple-700">Mint and Fractionalize it!</h2>
        <div className=" my-20 flex items-center justify-center">
          <div className="max-w-4xl">
              <div className="p-4 border-b">
                  <h2 className="text-2xl ">
                      Please confirm that your information is valid
                  </h2>
                  <p className="text-sm text-gray-500">
                      Personal details and application. 
                  </p>
              </div>
              <div>
                  <div className={ !isValid ? "md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-red-500": "md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b"}>
                      <p className="text-gray-600">
                          Preferred Name
                      </p>
                      <p>
                          {userName}
                      </p>
                  </div>
                  <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                      <p className="text-gray-600">
                          Discord handle
                      </p>
                      <p>
                          {discord}
                      </p>
                  </div>
                  <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                      <p className="text-gray-600">
                          Art Piece
                      </p>
                      <p>
                          {artName}
                      </p>
                  </div>
                  <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                      <p className="text-gray-600">
                          Standard
                      </p>
                      <p>
                          {standard}
                      </p>
                  </div>
                  <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                      <p className="text-gray-600">
                          Description
                      </p>
                      <p>
                          {artDesc}
                      </p>
                  </div>
                  <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                      <p className="text-gray-600">
                        Token symbol
                      </p>
                      <input 
                        placeholder="PUNKS" 
                        className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                        onChange={tokenSymbolHandler}
                        maxLength="8"
                        /> 
                  </div>
                  <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                      <p className="text-gray-600">
                          Token supply
                      </p>
                      <p>
                      <input 
                        placeholder="1000" 
                        className={`${styles.textBorder} ${!validSupply ? 'border-red-500' : ''}`}
                        onChange={tokenSupplyHandler}
                        onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                        maxLength="5"
                        /> 
                      </p>
                  </div>
                  <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                      <p className="text-gray-600">
                          Token price
                      </p>
                      <p>
                      <input 
                        placeholder="50" 
                        className={`${styles.textBorder} ${!validPrice ? 'border-red-500' : ''}`}
                        onChange={tokenPriceHandler}
                        onKeyPress={(event) => {
                            if (!/^\d*\.?\d*$/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                        maxlength="3"
                        /> 
                      </p>
                  </div>
                  <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                      <p className="text-gray-600">
                          Amount to be raised
                      </p>
                      <p>
                      <input 
                        placeholder="$50000" 
                        className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                        onKeyDown={(event) => {
                          event.preventDefault();
                        }}
                        value={`${amtEth.toFixed(2)} ETH/ US$ ${amtUSD.toFixed(2)}`}
                        />
                      </p>
                  </div>
                  <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                      <p class="text-gray-600">
                        Deadline (+ 7 days)
                      </p>
                      <p>
                        <input 
                          type="checkbox" 
                          checked={deadline ? "checked" : ""} 
                          class="checkbox" 
                          onChange={deadlineHandler}
                        />
                      </p>
                  </div>
                  <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b items-center">
                      <p class="text-gray-600">
                        Image
                      </p>
                    <img src={URL.createObjectURL(newFile.nftImage[0])}></img>
                  </div>
              </div>
          </div> 
        </div>
        <button 
          className="text-base ml-2 w-40 hover:scale-110 hover:bg-purple-600 focus:shadow-outline focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
          hover:bg-teal-600  
          bg-purple-500 
          text-white 
          font-bold
          border duration-200 ease-in-out 
          border-teal-600 transition"
        >Mint</button>
      </div>          
          }

      <div className="flex p-2 mt-4">
          { step!=0 && <button 
            className="text-base  ml-2  hover:scale-110 hover:bg-purple-600 focus:shadow-outline focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
            hover:bg-teal-600  
            bg-purple-500 
            text-white 
            font-bold
            border duration-200 ease-in-out 
            border-teal-600 transition"
            onClick={selectPrevHandler}
          >Previous
          </button>}
        <div className="flex-auto flex flex-row-reverse">
          {step!=3 && <button className="text-base  ml-2  hover:scale-110 hover:bg-purple-600 focus:shadow-outline focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
            hover:bg-teal-600  
            bg-purple-500 
            text-white 
            font-bold
            border duration-200 ease-in-out 
            border-teal-600 transition"
            onClick={selectNextHandler}
            >Next</button>}
            </div>
        </div>
  </div>


    </>
  )
}

export default ArtForm;