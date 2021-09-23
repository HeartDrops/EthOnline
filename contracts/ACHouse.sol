// "SPDX-License-Identifier: UNLICENSED"

pragma solidity ^0.8.3;



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



    function isUserRegistered( address _address) internal view returns (bool) {
         
        for( uint8 j = 0; j < RegisteredUserAddresses.length; j++){
             
            if(RegisteredUserAddresses[j] == _address){
                return (true); // user is registered.
            }
        }
        return (false); // user is not registered.
    }

}
