pragma solidity ^0.8.3;
//"SPDX-License-Identifier: UNLICENSED"

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";




contract ACHouseToken1155 is ERC1155 {

    address parentAddress;
    
    constructor() ERC1155("") {}

   function setParentAddress(address _address) public {
       parentAddress = _address;
   }

   function mintNFT(address _ownerAddress, string memory _uri, uint256 _id) public {
       // using erc 1155 to creat NFT
       // mint will create NFT and send it to the address. IF address is parent contract then it will throw error unless IERC1155Receiver.onERC1155BatchReceived is implemented. 

       _setURI(_uri);
       _mint(_ownerAddress, _id, 1, ""); 
   }


   
   
   
   
   // owner address is prob artist address. USING ERC1155
//    function mintNFT1155(address _ownerAddress, string memory _uri, uint256 _id, uint256 _supply) public {

//        // using erc 1155 to creat NFT
//        ERC1155(_uri)._mint(_ownerAddress, _id, 1, ""); // ERC 721 like but still ERC1155 NFT token

//        ERC1155(_uri)._mint(_ownerAddress, _id, 10**9, ""); // ERC 20 like but its still ERC1155 fungible token

//        // transfer to the owner part comes here
//    }

//    // owner address is prob artist address. USING ERC721
//    function mintNFT721(address _ownerAddress, string memory _uri, string memory _name, string memory _symbol, uint256 _id, uint256 _supply) public {

//        // using erc 1155 to creat NFT
//        ERC721(_name, _symbol)._mint(_ownerAddress, _id);

//        // transfer to the owner part comes here
//    }

//    function mintERC20(address _ownerAddress,string memory _name, string memory _symbol, uint256 _supply) public {
//        ERC20(_name, _symbol)._mint(_ownerAddress, 10**9);
//    }
    
}