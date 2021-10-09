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
        domain: null
    });
    const [nftUri, setNftUri] = useState(null);
    const [nftSupply, setNftSupply] = useState(null);
    const [nftTokenName, setNftTokenName] = useState(null);
    const [nftTokenSymbol, setNftTokenSymbol] = useState(null);
    const [nftMetadata, setNftMetadata] = useState(null);

    const [statesToPass, setStatesToPass] = useState([]);
    
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

        // ---- get info on token for 1155 -----
        async function getNftUri1155() {
            let data = await props.ACHouse.getTokenURI(props.item.tokenId).then((f) => {
                console.log("Token URI: ", f);
                // if string then f.toString();
                setNftUri(f);
            });
        }; 
        async function getNft1155Supply() {
            let data = await props.ACHouse.getTokenSupply(props.item.tokenId).then((f) => {
                // console.log("Token Supply for id", f.toNumber());
                setNftSupply(f.toNumber());
            });
        }; 

        // ---- get info on token for 721 -----
        async function get721TokenName() {
            let data = await contractACHouse.get721TokenName(props.item.tokenId).then((f) => {
                console.log("Token Name for id", f);
                return f;
            });
        }
        async function get721TokenSymbol() {
            let data = await contractACHouse.get721TokenSymbol(props.item.tokenId).then((f) => {
                console.log("Token Symbol for id", f);
                setNftTokenSymbol(f);
            });
        }
        async function get721TokenURI() {
            let data = await contractACHouse.get721TokenURI(props.item.tokenId).then((f) => {
                console.log("721Token URI: ", f);
                // if string then f.toString();
                setNftUri(f);
            });
        }
        
        if (props.item.tokenId && nftSupply == null && nftUri == null) {
            if (props.item.isMultiToken) { // 1155
                getNftUri1155();
                getNft1155Supply();
                if (nftMetadata == null)
                    loadNFT();
            } else { // 721
                get721TokenURI();
                get721TokenSymbol();
                get721TokenName();
                if (nftMetadata == null)
                    loadNFT();
            }
        };

        async function loadNFT() {
            const tokenUri = 'ipfs://bafyreih76tru7mgvpjqszqfjnipbqf5hbit2x37cddpu57slid7kwkeyxy/metadata.json';
            console.log("https://ipfs.infura.io/ipfs/" + tokenUri.slice(7))
            const meta = await axios.get("https://ipfs.infura.io/ipfs/" + tokenUri.slice(7))
            console.log(meta);
            setNftMetadata(meta.data);
          };

        setStatesToPass({
            item: props.item,
            nft_uri: nftUri,
            end_date: endDate,
            nft_metadata: nftMetadata
        });

    }, [endDate, charityInfo, nftMetadata]);

    console.log(nftMetadata);


    return (
        <>
            <div className="card bordered shadow-2xl" key={props.item.itemId}>
                    <img src="https://images.squarespace-cdn.com/content/v1/50e5fc10e4b0291e3b9b75c6/1615390602909-4MPRJWZ9JND1Q72OFK4Y/loop.gif" className="cnt-centered" />
                    {/* <img src={nftMetadata && nftMetadata.image} /> */}
                <div className="card-body">
                    <h2 className="card-title">{nftMetadata && nftMetadata.name}<span className=""> by ARTIST_NAME</span> 
                        {endDate.ongoing ? <div className="badge mx-2 badge-secondary">ONGOING</div> : <div className="badge mx-2 badge-accent">FINISHED</div>}
                        <div className="badge mx-2 badge-accent">{charityInfo.domain}</div>
                    </h2> 
                    <div className="mx-2 my-3">
                        <p>{nftMetadata && nftMetadata.description}.</p> 
                    </div>
                    <div className="mx-2 my-3">
                        <span>Donated by DONOR_NAME</span>
                        <span>  for {charityInfo.name}</span>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap justify-between mx-2 my-3 cursor-pointer">
                        <div className="px-2 mb-4 lg:mb-0 flex-shrink-0">
                            <div className="uppercase text-xs text-gray-500 font-bold mb-2">Token Type</div>
                            {props.item.isMultiToken ? <div className="font-bold">ERC 1155</div> : <div className="font-bold">ERC 721</div>}
                        </div>
                        <div className="px-2 mb-4 lg:mb-0 flex-shrink-0">
                            <div className="uppercase text-xs text-gray-500 font-bold mb-2">Token Name</div>
                            <div className="font-bold">{nftTokenSymbol}</div>
                        </div>
                        <div className="px-2 mb-4 lg:mb-0 flex-shrink-0">
                            <div className="uppercase text-xs text-gray-500 font-bold mb-2">Total Supply</div>
                            {props.item.isMultiToken ? <div className="font-bold">{nftSupply}</div> : ""}
                        </div>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap justify-between mx-2 my-3 cursor-pointer">
                        {endDate.timestamp ? 
                         <div className="px-2 mb-4 lg:mb-0 flex-shrink-0">
                            <div className="uppercase text-xs text-gray-500 font-bold mb-2">Time left to participate</div>
                            <Countdown end={endDate.timestamp} size="small" />
                        </div> : ''}

                        <div className="px-2 mb-4 lg:mb-0 flex-shrink-0">
                            <div className="justify-end card-actions">
                                <Link className="btn btn-secondary" to={{ pathname: `/donate/${props.item.itemId}`, state : statesToPass }}>Donate</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </>
    );

};

export default ShowcaseAuctions;