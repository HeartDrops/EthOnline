pragma solidity ^0.8.3;
//"SPDX-License-Identifier: UNLICENSED"

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract ACHouseToken20 is ERC20 {
    
    address public owner;
    
    uint256 totalSupply_;
    
    constructor(string memory name, string memory symbol, uint256 count) ERC20(name, symbol) {
        
        owner = msg.sender;
        
        _mint(msg.sender, count);
        
    }
    
    
}