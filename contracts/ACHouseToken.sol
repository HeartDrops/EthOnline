pragma solidity ^0.8.3;
// pragma solidity 0.7.6;
//"SPDX-License-Identifier: UNLICENSED"

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract ACHouseToken {

    address parentAddress;

    
   

   function setParentAddress(address _address) public {
       parentAddress = _address;
   }

   
    
}