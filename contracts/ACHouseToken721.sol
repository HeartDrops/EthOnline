pragma solidity ^0.8.3;
//"SPDX-License-Identifier: UNLICENSED"

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ACHouseToken721 is ERC721, ERC721URIStorage {

    address parentAddress;

    uint256[] tokensIdscreated;
    
    constructor() ERC721("","") {
    }
    
    function setParentAddress(address _address) public {
        parentAddress = _address;
    }

    function mintNFT(address _ownerAddress, uint256 _id, string memory _tokenUri) public {
       // using erc 721 to creat NFT
       // mint will create NFT and send it to the address. 

       _safeMint(_ownerAddress, _id, ""); 
       _setTokenURI(tokenId, _tokenURI);
       
       tokensIdscreated.push(_id);
       
       //apprvove parent contract to handle tokens and transactions.
       setApprovalForAll(parentAddress, true);
    }

    function getTokenUri(uint256 tokenId) public returns(string memory){
        return tokenURI(tokenId);
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