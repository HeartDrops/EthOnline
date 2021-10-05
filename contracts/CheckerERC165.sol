pragma solidity ^0.8.3;
//"SPDX-License-Identifier: UNLICENSED"

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";



contract CheckERC165 is ERC165 {
    mapping (bytes4 => bool) internal supportedInterfaces;

    constructor() public {
        supportedInterfaces[super.supportsInterface.selector] = true;
    }
    
    /// @notice Query if a contract implements an interface
    /// @param interfaceID The interface identifier, as specified in ERC-165
    /// @dev Interface identification is specified in ERC-165. This function
    ///  uses less than 30,000 gas.
    /// @return `true` if the contract implements `interfaceID` and
    ///  `interfaceID` is not 0xffffffff, `false` otherwise
    function supportsInterface(bytes4 interfaceID) public override view returns (bool){
        return supportedInterfaces[interfaceID];
    }
}