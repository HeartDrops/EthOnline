// "SPDX-License-Identifier: UNLICENSED"
pragma solidity ^0.8.3;

import "./ACHouseToken1155.sol";
import "./ACHouseToken721.sol";

// import "./ACHouseToken20.sol";
// import "./CheckerERC165.sol";

// import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
// import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
// import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol"

// import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
// import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract ACHouse {

    address owner;

    ACHouseToken1155 _multiToken;
    ACHouseToken721 _nftToken;

       /** Variables and Event Emitters */
    struct AuctionPlace {
        uint256 id;
        string name;
    }
    struct Artist {
        uint256 id;
        string name;
    }
    struct Participant {
        uint256 id;
        string name;
    }
    struct NGO {
        uint256 id;
        string name;
    }

    uint auctionPlaceCount = 0;
    uint artistCount = 0;
    uint participantCount = 0;
    uint ngoCount = 0;
    NGO[] public ngoArray;
    address[] RegisteredUserAddresses; // might be used??

    // mapping address to type
    mapping (address => AuctionPlace) AuctionPlaceMapping;
    mapping (address => Artist) ArtistMapping;
    mapping (address => Participant ) ParticipantMapping;
    mapping (address => NGO ) NgoMapping; 
    
    // User address maps to - Chaities and the donation amount. 
    mapping ( address =>  mapping (address => uint256)) UserNGODonation;
    

    constructor(address _mToken, address _nToken){
        _multiToken = ACHouseToken1155(_mToken);
        _nftToken = ACHouseToken721(_nToken);
    }
    
    /**Functions - Registration  */
    function register(string memory _name, uint _userType) public returns (bool) {
        require(isUserRegistered(msg.sender) == false, "User Already registered");

        //userType { 1: Auction, 2: Artist, 3: Participant}
        // register user by type
        if(_userType == 1){
            AuctionPlace memory ac = AuctionPlace(auctionPlaceCount, _name);
            auctionPlaceCount++;

            AuctionPlaceMapping[msg.sender] = ac;
        }else if( _userType == 2){
            Artist memory ar = Artist(artistCount, _name);
            artistCount++;

            ArtistMapping[msg.sender] = ar;
        }else {
            Participant memory part = Participant(participantCount, _name);
            participantCount++;

            ParticipantMapping[msg.sender] = part;
        }

        RegisteredUserAddresses.push(msg.sender);
        return true;
    }

    /**ERC1155 functionality */
    function setURI1155(string memory _uri) public {
        _multiToken.setURI(_uri);
    }
    // mint 1155 NFT - set supply to 1. 
    function createNFT1155(uint256 _id, uint256 _amount) public {
        _multiToken.mintNFT(msg.sender, _id, _amount);
    }

    //get tokens totalnumber. 
    function getTokenCount() public returns (uint256) {
        return _multiToken.getTokenCount();
    }
    //returns the array of all tokenids. 
    function getTokenIds() public returns (uint256[] memory) {
        return _multiToken.getTokenIds();
    }


    /**Helpers */
    function isUserRegistered( address _address) internal view returns (bool) {
         
        for( uint8 j = 0; j < RegisteredUserAddresses.length; j++){
             
            if(RegisteredUserAddresses[j] == _address){
                return (true); // user is registered.
            }
        }
        return (false); // user is not registered.
    }

    // //ERC1155 
    // function onERC1155Received( address operator, address from, uint256 id, uint256 value, bytes calldata data ) override external returns (bytes4){
        
    //     // external transfer of Token to parent contract will trigger this function. Leverage this to 
    //     // continue the transfer to the ACHouseToken1155 which holds all 1155 tokens. 
    //     _multiToken.safeTransferFrom(from, address(_multiToken), id, value, data);
        
    //     return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));
    // }
    
    // function onERC1155BatchReceived( address operator, address from, uint256[] calldata ids, uint256[] calldata values, bytes calldata data ) override external returns (bytes4) {

    //     // external transfer of Token to parent contract will trigger this function. Leverage this to 
    //     // continue the transfer to the ACHouseToken1155 which holds all 1155 tokens. 
    //     _multiToken.safeBatchTransferFrom(from, address(_multiToken), ids, values, data);

    //     return bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"));
    // }

}
