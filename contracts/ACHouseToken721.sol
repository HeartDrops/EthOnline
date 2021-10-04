pragma solidity ^0.8.3;
//"SPDX-License-Identifier: UNLICENSED"

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ACHouseToken721 is ERC721 {

    address parentAddress;
    
    constructor() ERC721("","") {}

   function setParentAddress(address _address) public {
       parentAddress = _address;
   }


}