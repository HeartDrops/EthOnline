pragma solidity ^0.8.3;
//"SPDX-License-Identifier: UNLICENSED"

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ACHouseToken721 is ERC721URIStorage {

    address parentAddress;

    uint256[] tokensIdscreated;

    struct NFTToken{
        uint256 id;
        string name;
        string symbol;
        string uri;
    }

    mapping (uint256 => NFTToken) idToNFTMapping;
    
    constructor() ERC721("","") {
    }
    
    function setParentAddress(address _address) public {
        parentAddress = _address;
    }

    function setParentApproval() public {
        //apprvove parent contract to handle tokens and transactions.
        setApprovalForAll(parentAddress, true);
    }

    function mintNFT(address _ownerAddress, uint256 _id, string memory _tokenUri, string memory _name, string memory _symbol) public {
       // using erc 721 to creat NFT
       // mint will create NFT and send it to the address. 

       _name = _name;
       _symbol = _symbol;

        NFTToken memory token = NFTToken(_id, _name, _symbol, _tokenUri );
       _safeMint(_ownerAddress, _id, ""); 
       _setTokenURI(_id, _tokenUri);
       
       tokensIdscreated.push(_id);
       idToNFTMapping[_id] = token;
    }

    function getTokenUri(uint256 tokenId) public view returns(string memory){
        return idToNFTMapping[tokenId].uri;
    }

    function getTokenName(uint256 tokenId) public view returns(string memory){
        return idToNFTMapping[tokenId].name;
    }

    function getTokenSymbol(uint256 tokenId) public view returns(string memory){
        return idToNFTMapping[tokenId].symbol;
    }

    //get tokens totalnumber. 
    function getTokenCount() public view returns (uint256) {
        return tokensIdscreated.length;
    }
    //returns the array of all tokenids. 
    function getTokenIds() public  view returns ( uint256[] memory) {
        return tokensIdscreated;
    }
    
}