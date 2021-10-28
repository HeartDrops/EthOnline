import React, {useState, useEffect} from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { ethers } from 'ethers';
import DB from '../db.json';
import Countdown from '../components/countdown';
import axios from 'axios'

const ShowcaseAuctions = (props) => {

    const [artistId, setArtistId] = useState(null);
    const [nftUri, setNftUri] = useState(null);
    const [nftSupply, setNftSupply] = useState(null);
    const [nftTokenName, setNftTokenName] = useState(null);
    const [nftTokenSymbol, setNftTokenSymbol] = useState(null);
    const [nftMetadata, setNftMetadata] = useState(null);
    const [auctionIsOngoing, setAuctionIsOngoing] = useState(null);

    const [statesToPass, setStatesToPass] = useState({
        nft_supply: [],
        nft_metadata: null,
        nft_uri: null,
        nft_token_name: null,
        nft_symbol: null,
        items: null
      });
    
    useEffect(() => {
        if (props.item.seller && artistId == null) {
			const artists = DB.artists;
			artists.map((i) => {
				if(i.address == props.item.seller) {
                    // console.log('i', i);
					setArtistId(i.id);
				}
			});
            console.log('use effect artist id');
        };
        if (props.item.auctionTime && auctionIsOngoing == null) {
            console.log('test', isGoing(props.item.auctionTime));
            setAuctionIsOngoing(isGoing(props.item.auctionTime));
        }
    }, [artistId, auctionIsOngoing]);

    const isGoing = (auctionTime) => {
        let ongoingAuction = 0;

        if (auctionTime == 0) {
            ongoingAuction = 1;
        } else {
            const difference = new Date(auctionTime * 1000).getTime() - new Date().getTime();
            if (difference > 0) {
                ongoingAuction = 1;
            }
        }
        return ongoingAuction;
    }
    
    useEffect(() => {

        if (nftUri == null) {
            if (props.item.isMultiToken) { 
                getNftUri1155(props.item.tokenId);
                getNft1155Supply(props.item.tokenId);
            } else {
                get721TokenURI(props.item.tokenId);
                get721TokenSymbol(props.item.tokenId);
                get721TokenName(props.item.tokenId);
            }
        }
    }, [nftUri, nftMetadata]);

    async function loadNFT(uri) {
        // console.log("https://ipfs.infura.io/ipfs/" + nftUri.slice(7))
        const meta = await axios.get("https://ipfs.infura.io/ipfs/" + uri.slice(7))
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
        let data = await props.ACHouse.getTokenURI(id).then((f) => {
            console.log("Token URI 1155: ", f);
            // if string then f.toString();
            setNftUri(f);
            loadNFT(f);
            // setStatesToPass({ ...statesToPass, nft_uri: f.toString() });
        });
    }; 
    async function getNft1155Supply(id) {
        let data = await props.ACHouse.getTokenSupply(id).then((f) => {
            // console.log("Token Supply for id", f.toNumber());
            setNftSupply(f.toNumber());
            // setStatesToPass({ ...statesToPass, nft_supply: f.toNumber() });
        });
    }; 

    // ---- get info on token for 721 -----
    async function get721TokenName(id) {
        let data = await contractACHouse.get721TokenName(id).then((f) => {
            // console.log("Token Name for id", f);
            setNftTokenName(f);
        });
    }
    async function get721TokenSymbol(id) {
        let data = await contractACHouse.get721TokenSymbol(id).then((f) => {
            console.log("Token Symbol for id", f);
            setNftTokenSymbol(f);
            // setStatesToPass({ ...statesToPass, nft_symbol: f });
        });
    }
    async function get721TokenURI(id) {
        let data = await contractACHouse.get721TokenURI(id).then((f) => {
            console.log("721Token URI: ", f);
            // if string then f.toString();
            setNftUri(f);
            loadNFT(f);
            // setStatesToPass({ ...statesToPass, nft_uri: test });
        });
    }

    // ----- functions called in DOM ------
    const getCharityInformation = (id, dataType) => {
        if (id && dataType) {
            return DB.charities[id][dataType];
        }
    }
    const getArtistInformation = (id, dataType) => {
        if (id && dataType) {
            return DB.artists[id][dataType];
        }
    }
    const getFormattedTime = async (timestamp) => {
        const a = new Date(timestamp * 1000);
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const year = a.getFullYear();
        const month = months[a.getMonth()];
        const date = a.getDate();
        const hour = a.getHours();
        const min = a.getMinutes();
        const sec = a.getSeconds();
        const formattedTime = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;

        return formattedTime;
    };

    return (
        <>
            <div className="card shadow-2xl">
                <div className="px-10 pt-4">
                    {auctionIsOngoing ? <div className="badge badge-secondary text-primary-content font-bold">ONGOING</div> : <div className="badge mx-2 badge-accent text-primary-content">FINISHED</div>}
                    <div className="badge badge-primary text-primary-content uppercase mx-2 font-bold">for {props.item.charityId ? getCharityInformation(props.item.charityId, 'domain') : ""}</div>
                    <figure className="pt-4">
                        {nftMetadata && nftMetadata.image && <img src={nftMetadata.url} className="cnt-centered rounded-xl" />}
                    </figure>
                </div>
                <div className="card-body">
                    <h2 className="card-title px-2 text-center">{nftMetadata && nftMetadata.name}<span className=""> created by {artistId ? getArtistInformation(artistId, 'name') : "not found"}</span> </h2> 
                    <div className="mb-4 px-2 text-center">
                        <span>Donated by {artistId ? getArtistInformation(artistId, 'name') : "not found"}</span>{' '}
                        <span>for {props.item.charityId ? getCharityInformation(props.item.charityId, 'name') : ""}</span>
                    </div>

                        <div className="flex flex-wrap md:flex-nowrap justify-between my-3 cursor-pointer px-2">
                            {auctionIsOngoing ? 
                            <div className="mb-4 lg:mb-0 flex-shrink-0 text-center">
                                <div className="uppercase text-xs text-gray-500 font-bold mb-2">Time left to participate</div>
                                <div className="center-cnt mb-5">
                                <Countdown end={props.item.auctionTime} />
								</div>
                            </div> : ''}

                            <div className="px-2 mb-4 lg:mb-0 flex-shrink-0">
                                <div className="justify-end card-actions">
                                    <Link className="btn btn-primary text-primary-content" to={{ pathname: `/donate/${props.item.itemId}`, state : [{item: props.item, uri: nftUri, supply: nftSupply, metadata: nftMetadata, tokenName: nftTokenName, tokenSymbol: nftTokenSymbol, artistId: artistId}]}}>Donate <img className="ml-2" height="10" width="20" src="https://freight.cargo.site/t/thumbnail/w/100/i/7f7bbd305c0db77b741361e48b637588c0c47f141fcfb76be3e751b2adf3fff5/logo-heart-drops.svg" /></Link>
                                </div>
                            </div>
                        </div>

                        <div className="border-t-2 text-primary"></div>

                        <div className="flex flex-wrap md:flex-nowrap justify-between my-3 cursor-pointer px-2">
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
                                {props.item.isMultiToken ?<div className="font-bold">{nftSupply}</div> : ""}
                            </div>
                        </div>

                </div>
            </div> 
        </>
    );

};

export default ShowcaseAuctions;