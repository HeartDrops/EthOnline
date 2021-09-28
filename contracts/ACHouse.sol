// "SPDX-License-Identifier: UNLICENSED"

pragma solidity ^0.8.3;

// import "./ACHouseToken.sol";

contract ACHouse  {
    
    
    /** Variables and Event Emitters */
    struct Auction {
        string name;
        address id; // wallet address of init setup
    }

    struct Artist {
        string name;
        address id; // wallet address of init setup
    }

    struct Participant {
        string name;
        address id;
    }

    address[] RegisteredUserAddresses;

    mapping (address => Auction) AuctionMapping;
    mapping (address => Artist) ArtistMapping;
    mapping (address => Participant ) ParticipantMapping;

    /**Functions - Registration  */
    function register(string memory _name, uint _userType) public returns (bool) {
        require(isUserRegistered(msg.sender) == false, "User Already registered");

        //userType { 1: Auction, 2: Artist, 3: Participant}
        // register user by type
        if(_userType == 1){
            Auction memory ac = Auction(_name, msg.sender);
            AuctionMapping[msg.sender] = ac;
        }else if( _userType == 2){
            Artist memory ar = Artist(_name, msg.sender);
            ArtistMapping[msg.sender] = ar;
        }else {
            Participant memory part = Participant(_name, msg.sender);
            ParticipantMapping[msg.sender] = part;
        }

        RegisteredUserAddresses.push(msg.sender);
        return true;
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

    function fracNFT(string memory _shardName, string memory _shardSymbol, uint256 supply, uint256 _ownerRetain, uint256 _price) public {
        // owner retain - amount of shards (tokes) will be given to the user, if all then end of steps. 
        // if user wants to generate funds, owner retain will be less than 100 and user sets price per shard (token). 

        //calls ACHouseToken.mintERC1155 or ACHouseToken.mintERC20 depending on implementation
    }
    */

    function createNFT() public {

        // if using ERC1155 - we need to create a JSON object and store it in IPFS or in blockchain. it requires a URI pointed at json file and then minting can take place. 
        // if using ERC721 - only name and symbol is needed to along with unique id for the NFT to create. 
        //calls ACHouseToken.mintERC1155 or ACHouseToken.mintERC721 depending on implementation
    }



    function isUserRegistered( address _address) internal view returns (bool) {
         
        for( uint8 j = 0; j < RegisteredUserAddresses.length; j++){
             
            if(RegisteredUserAddresses[j] == _address){
                return (true); // user is registered.
            }
        }
        return (false); // user is not registered.
    }

}
