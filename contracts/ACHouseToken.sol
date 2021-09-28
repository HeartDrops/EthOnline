pragma solidity ^0.8.3;
// pragma solidity 0.7.6;
//"SPDX-License-Identifier: UNLICENSED"

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";


/**Notes  */
/**
ERC1155 seems to have the latest functionality when it comes to minting nft or fractionalize. However this is a brand new tech and may not be compatible with
many of the current market. 

_mint can be used to create NFT or fungible tokens by changing the supply to 1 - NFT, > 1 fungible toknes. 
its mandatory to also include a URI ( json format ) which contains the name, description, Image and other params when minting. Probabaly need to integrae IPFS 
to store the JSON data. or we can store it directly in structs and the image in IPFS. 

----------------- if not using ERC 1155 ------------------------
ERC 721 can be used to create the NFT which is what opensea uses and so does other NFT sites. which means we can connect to third party sites if need be ( prob not for demo)
same with ERC 20 industry standard or we can use ERC777 which is ERC20 with better safegaurds. 

*/


contract ACHouseToken is ERC1155, ERC721, ERC20 {

    address parentAddress;

   function setParentAddress(address _address) public {
       parentAddress = _address;
   }

   // owner address is prob artist address. USING ERC1155
   function mintNFT1155(address _ownerAddress, string memory _uri, uint256 _id, uint256 _supply) public {

       // using erc 1155 to creat NFT
       ERC1155(_uri)._mint(_ownerAddress, _id, 1, ""); // ERC 721 like but still ERC1155 NFT token

       ERC1155(_uri)._mint(_ownerAddress, _id, 10**9, ""); // ERC 20 like but its still ERC1155 fungible token

       // transfer to the owner part comes here

   }

   // owner address is prob artist address. USING ERC721
   function mintNFT721(address _ownerAddress, string memory _uri, string memory _name, string memory _symbol, uint256 _id, uint256 _supply) public {

       // using erc 1155 to creat NFT
       ERC721(_name, _symbol)._mint(_ownerAddress, _id);

       // transfer to the owner part comes here

   }

   function mintERC20(address _ownerAddress,string memory _name, string memory _symbol, uint256 _supply) public {
       ERC20(_name, _symbol)._mint(_ownerAddress, 10**9);
   }
    
}