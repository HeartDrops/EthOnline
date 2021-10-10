import React, {useState, useEffect} from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { ethers } from 'ethers';
import DB from '../db.json';
import Countdown from '../components/countdown';
import axios from 'axios'

const ShowcaseAuctions = (props) => {

    const [endDate, setEndDate] = useState({
        timestamp: null,
        visual: null,
        ongoing: null
    });
    const [charityInfo, setCharityInfo] = useState({
        id: null,
        name: null,
        domain: null
    });
    const [artistInfo, setArtistInfo] = useState({
        id: null,
		name: null,
		image: null,
		bio: null
    });
    const [nftUri, setNftUri] = useState(null);
    const [nftSupply, setNftSupply] = useState(null);
    const [nftTokenName, setNftTokenName] = useState(null);
    const [nftTokenSymbol, setNftTokenSymbol] = useState(null);
    const [nftMetadata, setNftMetadata] = useState(null);
    // const [statesToPass, setStatesToPass] = useState([]);
    const [statesToPass, setStatesToPass] = useState({
        nft_supply: [],
        nft_metadata: null,
        nft_uri: null,
        nft_token_name: null,
        nft_symbol: null,
        items: null
      });
    
    useEffect(() => {

        const generateEndDate = async () => {
            const a = new Date(props.item.auctionTime * 1000);
            const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            const year = a.getFullYear();
            const month = months[a.getMonth()];
            const date = a.getDate();
            const hour = a.getHours();
            const min = a.getMinutes();
            const sec = a.getSeconds();
            const formattedTime = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;

            const difference = new Date(props.item.auctionTime * 1000).getTime() - new Date().getTime();
            let ongoingAuction = 0;
            if (difference > 0) {
                ongoingAuction = 1;
            }
            setEndDate({
                timestamp: props.item.auctionTime,
                visual: formattedTime,
                ongoing: ongoingAuction
              });
        };
        if (props.item.auctionTime && endDate.timestamp == null && endDate.visual == null) {
            generateEndDate();
        };

        const getCharityInformation = () => {
            setCharityInfo({
                id: props.item.charityId,
                name: DB.charities[props.item.charityId].name,
                domain: DB.charities[props.item.charityId].domain
            });
        }
        if (props.item.charityId && charityInfo.id == null) {
            getCharityInformation();
        };
        
        if (props.item.seller && artistInfo.id == null) {
			const artists = DB.artists;
			artists.map((i) => {
				if(i.address == props.item.seller) {
                    console.log('i', i);
					setArtistInfo({
						id: i.id,
						name: i.name,
						image: i.profile,
						bio: i.bio,
					})
				}
			});
        };
        // ---- get info on token for 1155 -----
        async function getNftUri1155() {
            let data = await props.ACHouse.getTokenURI(props.item.tokenId).then((f) => {
                console.log("Token URI 1155: ", f);
                // if string then f.toString();
                setNftUri(f);
                setStatesToPass({ ...statesToPass, nft_uri: f.toString() });
            });
        }; 
        async function getNft1155Supply() {
            let data = await props.ACHouse.getTokenSupply(props.item.tokenId).then((f) => {
                // console.log("Token Supply for id", f.toNumber());
                setNftSupply(f.toNumber());
                setStatesToPass({ ...statesToPass, nft_supply: f.toNumber() });
            });
        }; 

        // ---- get info on token for 721 -----
        async function get721TokenName() {
            let data = await contractACHouse.get721TokenName(props.item.tokenId).then((f) => {
                // console.log("Token Name for id", f);
                setNftTokenName(f);
                setStatesToPass({ ...statesToPass, nft_token_name: f });
            });
        }
        async function get721TokenSymbol() {
            let data = await contractACHouse.get721TokenSymbol(props.item.tokenId).then((f) => {
                console.log("Token Symbol for id", f);
                setNftTokenSymbol(f);
                setStatesToPass({ ...statesToPass, nft_symbol: f });
            });
        }
        async function get721TokenURI() {
            let data = await contractACHouse.get721TokenURI(props.item.tokenId).then((f) => {
                console.log("721Token URI: ", f);
                const test = f.toString();
                // if string then f.toString();
                setNftUri(test);
                setStatesToPass({ ...statesToPass, nft_uri: test });
            });
        }

        if (nftUri == null) {
            if (props.item.isMultiToken) { 
                getNftUri1155();
            } else {
                get721TokenURI();
            }
        }
        
        if (props.item.tokenId && nftSupply == null) {
            setStatesToPass({ ...statesToPass, items: props.item });
            if (props.item.isMultiToken) { // 1155
                getNft1155Supply();
            } else { // 721
                get721TokenSymbol();
                get721TokenName();
            }
        };



        async function loadNFT() {
            // const tokenUri = 'ipfs://bafyreih76tru7mgvpjqszqfjnipbqf5hbit2x37cddpu57slid7kwkeyxy/metadata.json';
            if (nftUri != null) {
                console.log("https://ipfs.infura.io/ipfs/" + nftUri.slice(7))
                const meta = await axios.get("https://ipfs.infura.io/ipfs/" + nftUri.slice(7))
                console.log('meta', meta);
                setNftMetadata(meta.data);
                // setStatesToPass({ ...statesToPass, nft_metadata: meta });
            }
        };
        if (nftMetadata == null) {
            loadNFT();
        }
    }, [endDate, charityInfo, nftMetadata, nftUri]);

    const showState = () => {
        console.log('states', statesToPass);
        console.log('uri', nftMetadata);
    }
    return (
        <>
        {/* <button className="btn btn-primary btn-wide mx-2" onClick={showState}>Show State</button> */}
            <div className="card bordered shadow-2xl" key={props.item.itemId}>
                    <img src="https://images.squarespace-cdn.com/content/v1/50e5fc10e4b0291e3b9b75c6/1615390602909-4MPRJWZ9JND1Q72OFK4Y/loop.gif" className="cnt-centered" />
                    {/* <img src={nftMetadata && nftMetadata.image} /> */}
                <div className="card-body">
                    <h2 className="card-title">{nftMetadata && nftMetadata.name}<span className=""> created by {artistInfo && artistInfo.name}</span> 
                        {endDate.ongoing ? <div className="badge mx-2 badge-secondary text-primary-content">ONGOING</div> : <div className="badge mx-2 badge-accent text-primary-content">FINISHED</div>}
                    </h2> 
                    <div className="my-3">
                        <p>{nftMetadata && nftMetadata.description}.</p> 
                    </div>
                    <div className="my-3">
                        <span>Donated by {artistInfo.name}</span>{' '}
                        <span>for {charityInfo.name}</span>
                        <div className="badge badge-accent text-primary-content uppercase mx-2">for {charityInfo.domain}</div>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap justify-between my-3 cursor-pointer">
                        <div className="mb-4 lg:mb-0 flex-shrink-0">
                            <div className="uppercase text-xs text-gray-500 font-bold mb-2">Token Type</div>
                            {props.item.isMultiToken ? <div className="font-bold">ERC 1155</div> : <div className="font-bold">ERC 721</div>}
                        </div>
                        <div className="mb-4 lg:mb-0 flex-shrink-0">
                            <div className="uppercase text-xs text-gray-500 font-bold mb-2">Token Name</div>
                            <div className="font-bold">{nftTokenName}</div>
                        </div>
                        <div className="mb-4 lg:mb-0 flex-shrink-0">
                            <div className="uppercase text-xs text-gray-500 font-bold mb-2">Token Symbol</div>
                            <div className="font-bold">{nftTokenSymbol}</div>
                        </div>
                        <div className="mb-4 lg:mb-0 flex-shrink-0">
                            <div className="uppercase text-xs text-gray-500 font-bold mb-2">Total Supply</div>
                            {props.item.isMultiToken ? <div className="font-bold">{nftSupply}</div> : ""}
                        </div>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap justify-between my-3 cursor-pointer">
                        {endDate.timestamp ? 
                         <div className="mb-4 lg:mb-0 flex-shrink-0">
                            <div className="uppercase text-xs text-gray-500 font-bold mb-2">Time left to participate</div>
                            <Countdown end={endDate.timestamp} />
                        </div> : ''}

                        <div className="px-2 mb-4 lg:mb-0 flex-shrink-0">
                            <div className="justify-end card-actions">
                                <Link className="btn btn-secondary text-primary-content" to={{ pathname: `/donate/${props.item.itemId}`, state : statesToPass }}>Donate</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </>
    );

};

export default ShowcaseAuctions;