// "SPDX-License-Identifier: UNLICENSED"
pragma solidity ^0.8.3;

import "./ACHouseToken1155.sol";
import "./ACHouseToken721.sol";
import "./ACHouseToken20.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ACHouse  {

    address owner;

    ACHouseToken1155 multitoken;
    ACHouseToken721 nftToken;
    ACHouseToken20 fractoken;

    // constructor(address _erc1155token){

    //     owner = msg.sender;
    //     // token = IERC20(_erc20token);
    //     multitoken = IERC1155(_erc1155token);
    // }
    
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

    struct NFTContracts{
        ACHouseToken721 contracts;
        address nftcontractAddress;
    }

    struct fracNFTContracts{
        ACHouseToken20 contracts;
        address fraccontractAddress;
    }
    mapping (string => NFTContracts) NFTContractsMappings;
    mapping (string => fracNFTContracts) fracNFTContractsMappings;
    
    
    /** Getters function */
    function getNftData(string memory _nftName) public view returns (NFTContracts memory){
        return NFTContractsMappings[_nftName];
    }
    
    function getfracNftData(string memory _shard) public view returns (fracNFTContracts memory){
        return fracNFTContractsMappings[_shard];
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

    function createNFt() public {

    }

    function fracNFT(string memory _shardName, string memory _shardSymbol, uint256 supply) public {
        // owner retain - amount of shards (tokes) will be given to the user, if all then end of steps. 
        // if user wants to generate funds, owner retain will be less than 100 and user sets price per shard (token). 
        
        fractoken = new ACHouseToken20(_shardName, _shardSymbol, supply);
        
        fracNFTContracts memory cont = fracNFTContracts(fractoken, address(fractoken));
        
        fracNFTContractsMappings[_shardName] = cont;
    }
    
    

    /** after user connects wallet to web3 and gets access to website. 
    Options avaiable for USER:
        Create NFT 
        Fractionalize NFT

    function createNFT(string memory _name, string memory _symbol, string memory _desc, string memory _imageURL) public {

        // if using ERC1155 - we need to create a JSON object and store it in IPFS or in blockchain. it requires a URI pointed at json file and then minting can take place. 
        // if using ERC721 - only name and symbol is needed to along with unique id for the NFT to create. 

        //calls ACHouseToken.mintERC1155 or ACHouseToken.mintERC721 depending on implementation
    }

    */

    // function createNFT() public {

    //     // if using ERC1155 - we need to create a JSON object and store it in IPFS or in blockchain. it requires a URI pointed at json file and then minting can take place. 
    //     // if using ERC721 - only name and symbol is needed to along with unique id for the NFT to create. 
    //     //calls ACHouseToken.mintERC1155 or ACHouseToken.mintERC721 depending on implementation
    // }



    function isUserRegistered( address _address) internal view returns (bool) {
         
        for( uint8 j = 0; j < RegisteredUserAddresses.length; j++){
             
            if(RegisteredUserAddresses[j] == _address){
                return (true); // user is registered.
            }
        }
        return (false); // user is not registered.
    }

}
