pragma solidity ^0.8.3;
// "SPDX-License-Identifier: UNLICENSED"

import "./ACHouseToken1155.sol";
import "./ACHouseToken721.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract ACHouse is ReentrancyGuard, ERC1155Holder, ERC721Holder {
  using Counters for Counters.Counter;
  Counters.Counter private _itemIds;
  Counters.Counter private _itemsSold;
  Counters.Counter private _fracItemIds;
  Counters.Counter private _ngoIds;

  address owner;

  ACHouseToken1155 _multiToken;
  ACHouseToken721 _nftToken;

  MarketItem[] mItems;

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
    address charityAddress;
  }

  uint auctionPlaceCount = 0;
  uint artistCount = 0;
  uint participantCount = 0;
  uint ngoCount = 0;
  NGO[] public ngoArray;
  address[] RegisteredUserAddresses; // might be used??

  // mapping address to type
  mapping(address => AuctionPlace) AuctionPlaceMapping;
  mapping(address => Artist) ArtistMapping;
  mapping(address => Participant) ParticipantMapping;

  mapping(uint256 => NGO) NgoMapping;
  // User address maps to - Chaities and the donation amount. 
  mapping(address => mapping(address => uint256)) UserNGODonation;

  struct MarketItem {
    uint itemId;
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    uint256 amount;
    uint256 charityId;
    uint256 auctionTime;
    bool sold;
    bool isMultiToken;
    bool isRemoved;
    bool isFrac;
  }

  mapping(uint256 => MarketItem) private idMarketItemMapping;
  
  mapping( address => uint256[]) userItemCreatedMapping;
  mapping( address => uint256) userItemCreatedCountMapping;
  //user mapping to itemSold array
  mapping( address => uint256[]) userSoldItemMapping;
  //user sold count mapp;
  mapping ( address => uint256) userSoldCountMapping;
  //user mapping to purchased item  array
  mapping( address => uint256[]) userpurchasedItemMapping;
  //user purchased count mapp;
  mapping ( address => uint256) userPurchasedCountMapping;
  
  event MarketItemCreated(uint indexed itemId, address indexed nftContract, uint256 indexed tokenId, 
    address seller, uint256 price, uint256 amount, uint256 auctionTime, bool isMultiToken, bool isFrac);
  
  event MarketItemSold(uint indexed itemId, address indexed nftContract, uint256 indexed tokenId, 
    address seller, address owner, uint256 price, bool sold);

  /*******************fractionalize NFT */
  struct FractionalizeToken {
    uint itemId;
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    address fractionalContract;
    uint256 shardId;
    uint256 supplyMinted;
    uint256 supplyRemaining;
    bool isMultiToken;
  }
  // id to fracToken
  mapping(uint256 => FractionalizeToken) idToFracToken;
  //user purchase to id to amount purchased
  mapping (address => mapping(uint256 => uint256)) userShardPurchaseAmount;
  
  event FractionalTokenCreated(uint indexed itemId, address indexed nftContract, uint256 indexed tokenId, 
    address seller, address fractionalContract, uint256 shardId, uint256 supplyMinted, uint256 supplyRemaining,  bool isMultiToken);
    

  constructor(address _mToken, address _nToken) {
    _multiToken = ACHouseToken1155(_mToken);
    _nftToken = ACHouseToken721(_nToken);
    
    _multiToken.setParentAddress(address(this));
    _nftToken.setParentAddress(address(this));
    owner = payable(msg.sender);
  }

  function addCharity(address charityAddress, string memory name) public {
    _ngoIds.increment();
    uint256 id = _ngoIds.current();
    NGO memory charity = NGO(id, name, charityAddress);

    NgoMapping[id] = charity;
  }

  function getCharityInfo(uint256 _id) public view returns(NGO memory) {
    return NgoMapping[_id];
  }
  
  /***************************************************************************************************************************************/
  /**MarketPlace functionality */
  function create1155MarketItem(address nftContract, uint256 tokenId, uint256 price, uint256 amount, uint256 _charityId, uint256 auctionTime, bool isFrac) public payable nonReentrant returns (uint256){
    require(price > 0, "Price must be at least 1 wei");

    _itemIds.increment();
    uint256 itemId = _itemIds.current();
    
    MarketItem memory item = MarketItem(itemId, nftContract, tokenId, payable(msg.sender), payable(address(0)), price / 1 ether, amount, _charityId, auctionTime, false, true, false, isFrac); // amount will always be 1. 
    idMarketItemMapping[itemId] = item;

    // increament user item created count and store and push itemId to userItem Created mapping
    uint256 userCount = userItemCreatedCountMapping[msg.sender];
    userItemCreatedCountMapping[msg.sender] = userCount++;
    userItemCreatedMapping[msg.sender].push(itemId);

    IERC1155(nftContract).safeTransferFrom(msg.sender, address(this), tokenId, amount, '[]');

    emit MarketItemCreated(itemId, nftContract, tokenId, msg.sender, price, amount, auctionTime, true, isFrac);

    return itemId;
  }

  function create721MarketItem(address nftContract, uint256 tokenId, uint256 price, uint256 _charityId, uint256 auctionTime, bool isFrac ) public payable nonReentrant returns (uint256){
    // require(price > 0, "Price must be at least 1 wei");
    // require(msg.value == listingPrice, "Price must be equal to listing price");

    _itemIds.increment();
    uint256 itemId = _itemIds.current();

    MarketItem memory item = MarketItem(itemId, nftContract, tokenId, payable(msg.sender), payable(address(0)), price, 1, _charityId, auctionTime, false, true, false, isFrac); // amount will always be 1. 
    idMarketItemMapping[itemId] = item;

    // increament user item created count and store and push itemId to userItem Created mapping
    uint256 userCount = userItemCreatedCountMapping[msg.sender];
    userItemCreatedCountMapping[msg.sender] = userCount++;
    userItemCreatedMapping[msg.sender].push(itemId);

    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

    emit MarketItemCreated(itemId, nftContract, tokenId, msg.sender, price, 1, auctionTime, false, isFrac);

    return itemId;
  }
  
  // Remove item from marketplace
  function removeMarketPlaceItem( uint256 itemId) public {
    idMarketItemMapping[itemId].isRemoved = true;
  }
  
  // re add item to marketplace
  function addMarketPlaceItem( uint256 itemId) public {
    idMarketItemMapping[itemId].isRemoved = false;
  }
  
  /* Creates the sale of a marketplace item */
  /* Transfers ownership of the item, as well as funds between parties */
  function createMarketSale(address nftContract, uint256 itemId) public payable nonReentrant {
    
    MarketItem memory item = idMarketItemMapping[itemId];
    
    uint price = item.price;
    uint tokenId = item.tokenId;
    bool isMultiToken = item.isMultiToken;
    require(msg.value >= price, "Buyer must trasfer Ether equal or greater than Price of Item");

    //set new owner inrecords.
    item.owner = payable(msg.sender);
    //set sold to true
    item.sold = true;
    //increament itemSold counter.
    _itemsSold.increment();
    
    //save updated item mapping. 
    idMarketItemMapping[itemId] = item;

    // mapp seller user-address to itemSold [] and increase sold count
    userSoldItemMapping[item.seller].push(itemId);
    uint256 sellerCount = userSoldCountMapping[item.seller];
    userSoldCountMapping[item.seller] = sellerCount++;
    
    //// mapp buyer user-address to itemPurchased [] 
    userpurchasedItemMapping[msg.sender].push(itemId);
    uint256 buyerCount = userPurchasedCountMapping[msg.sender];
    userPurchasedCountMapping[msg.sender] = buyerCount++;
    // transfer funds to seller. 
    item.seller.transfer(msg.value);

    //transfer ownership to buyer.
    if(isMultiToken){
      IERC1155(nftContract).safeTransferFrom(address(this), msg.sender, item.tokenId, item.amount, '[]');
    }else{
      IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
    }

    emit MarketItemSold( itemId, nftContract, tokenId, item.seller, msg.sender, price, true);
  }

  function fetchMarketItem(uint256 _id) public view returns(MarketItem memory){
    return idMarketItemMapping[_id];
  }

  /* Returns all unsold market items */
  function getUnSoldMarketItems() public view returns(MarketItem[] memory) {

    uint totalUnSoldCount = _itemIds.current() - _itemsSold.current();
    MarketItem[] memory items = new MarketItem[] (totalUnSoldCount);
    
    uint unsoldCurrentIndex = 0;
    
    uint totalItemCount = _itemIds.current();
      
    for(uint i=0; i < totalItemCount; i++){
        // only way i found to iterate through a mapping. 
        if(idMarketItemMapping[i+1].owner == address(0) && idMarketItemMapping[i+1].isRemoved == false ) { 
            uint currentID = i+1;

            MarketItem memory currentItem = idMarketItemMapping[currentID];
            items[unsoldCurrentIndex] = currentItem;
            unsoldCurrentIndex +=1;
        }
    }
    
    return items; 
  }

  /* Returns only items that a user has purchased */
  function fetchMyNFTs() public view returns (MarketItem[] memory) {
    
    uint256[] memory userPurchasedIds = userpurchasedItemMapping[msg.sender];

    MarketItem[] memory items = new MarketItem[](userPurchasedIds.length);

    for(uint i =0; i< userPurchasedIds.length; i++){
        items[i] = idMarketItemMapping[userPurchasedIds[i]];
    }
    return items;
  }

  /* Returns only items a user has created */
  function fetchItemsCreated() public view returns (MarketItem[] memory) {
    
    // get array of itemId user created.
    uint256[] memory userItem = userItemCreatedMapping[msg.sender];

    MarketItem[] memory items = new MarketItem[](userItem.length);
    
    //loop through array and fetch the marketItems
    for(uint i = 0; i < userItem.length; i++){
      items[i] = fetchMarketItem(userItem[i]);
    }

    return items;

  }

  function fetchUserSoldCount() public view returns (uint256){
    return userSoldCountMapping[msg.sender];
  }

  function fetchUserPurchasedCount() public view returns (uint256){
    return userPurchasedCountMapping[msg.sender];
  }
  
  /***************************************************************************************************************************************/
  /**Functions - Registration  */
  function register(string memory _name, uint _userType) public returns(bool) {
    require(isUserRegistered(msg.sender) == false, "User Already registered");

    //userType { 1: Auction, 2: Artist, 3: Participant}
    // register user by type
    if (_userType == 1) {
      AuctionPlace memory ac = AuctionPlace(auctionPlaceCount, _name);
      auctionPlaceCount++;

      AuctionPlaceMapping[msg.sender] = ac;
    } else if (_userType == 2) {
      Artist memory ar = Artist(artistCount, _name);
      artistCount++;

      ArtistMapping[msg.sender] = ar;
    } else {
      Participant memory part = Participant(participantCount, _name);
      participantCount++;

      ParticipantMapping[msg.sender] = part;
    }

    RegisteredUserAddresses.push(msg.sender);
    return true;
  }

  /**ERC1155 functionality ***********************************************/
  function setURI1155(string memory _uri) public {
    _multiToken.setURI(_uri);
  }

  function getTokenURI(uint256 _tokenId) public view returns(string memory){
    return _multiToken.getTokenURI(_tokenId);
  }
  // mint 1155 NFT - set supply to 1. 
  function createNFT1155(uint256 _id, uint256 _amount) public {
    _multiToken.mintNFT(msg.sender, _id, _amount);
  }

  //get tokens totalnumber. 
  function getTokenCount() public view returns(uint256) {
    return _multiToken.getTokenCount();
  }
  //returns the array of all tokenids. 
  function getTokenIds() public view returns(uint256[] memory) {
    return _multiToken.getTokenIds();
  }

  function getTokenSupply(uint256 _tokenId) public view returns(uint256) {
    return _multiToken.getTotalSupplyOfToken(_tokenId);
  }

  /*************Fractional NFT */

  //hold NFT and trasnfer ownership to ACHouse. 
  // ACHouse will mint 1155 then set it to orig owner of nft. 
  function fractionalize1155NFT(address nftContract, uint256 tokenId, uint256 shardId, uint256 supplyToCreate, string memory uri) public returns (uint256) {
    _fracItemIds.increment();
    uint fracId = _fracItemIds.current();

    FractionalizeToken memory fracItem = FractionalizeToken(fracId, nftContract, tokenId, payable(msg.sender), 
      payable(address(0)), address(_multiToken), shardId, supplyToCreate, supplyToCreate, true); // supplyMinted and SupplyRemaining will be set as same for now. 
    
    idToFracToken[fracId] = fracItem;

    //get ownership of nftContract and its token.
    IERC1155(nftContract).safeTransferFrom(msg.sender, address(this), tokenId, 1, '[]');
    
    //Mint 1155 fungible tokens. 
    setURI1155(uri); // call functiont to set uRL in 1155 token
    _multiToken.mintNFT(msg.sender, fracId, supplyToCreate); //shard tokens created and ownership set to msg.sender ( person who decided to frac nft.)
    
    emit FractionalTokenCreated(fracId, nftContract, tokenId, msg.sender, address(_multiToken), shardId, supplyToCreate, supplyToCreate, true);
    
    return fracId;
    
    
  }

  function fractionalize721NFT(address nftContract, uint256 tokenId, uint256 shardId, uint256 supplyToCreate, string memory uri) public returns (uint256) {
    _fracItemIds.increment();
    uint fracId = _fracItemIds.current();
    
     FractionalizeToken memory fracItem = FractionalizeToken(fracId, nftContract, tokenId, payable(msg.sender), 
      payable(address(0)), address(_multiToken), shardId, supplyToCreate, supplyToCreate, false); // supplyMinted and SupplyRemaining will be set as same for now. 
    
    idToFracToken[fracId] = fracItem;

    //get ownership of nftContract and its token.
    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

    //Mint 1155 fungible tokens.
    setURI1155(uri); // call functiont to set uRL in 1155 token
    _multiToken.mintNFT(msg.sender, fracId, supplyToCreate); //shard tokens created and ownership set to msg.sender ( person who decided to frac nft.)
    
    emit FractionalTokenCreated(fracId, nftContract, tokenId, msg.sender, address(_multiToken), shardId, supplyToCreate, supplyToCreate, false);
    
    return fracId;
  }

  function getFractionalInformation(uint256 _fracId) public view returns (FractionalizeToken memory ){
      
      FractionalizeToken memory item = idToFracToken[_fracId];
      
      return item;
  }
  
  /**ERC721 functionzlity *************************************************/
  // mint 721 NFT - set supply to 1. 
  function createNFT721(uint256 _id, string memory uri, string memory name, string memory symbol) public {
    _nftToken.mintNFT(msg.sender, _id, uri, name, symbol);
  }

  //get tokens totalnumber. 
  function get721TokenCount() public view returns(uint256) {
    return _nftToken.getTokenCount();
  }
  //returns the array of all tokenids. 
  function get721TokenIds() public view returns(uint256[] memory) {
    return _nftToken.getTokenIds();
  }

  function get721TokenName(uint256 _id) public view returns(string memory){
    return _nftToken.getTokenName(_id);
  }

  function get721TokenSymbol(uint256 _id) public view returns(string memory){
    return _nftToken.getTokenSymbol(_id);
  }

  function get721TokenURI(uint256 _id) public view returns(string memory) {
    return _nftToken.getTokenUri(_id);
  }

  /**Helpers */
  function isUserRegistered(address _address) internal view returns(bool) {
    for (uint8 j = 0; j < RegisteredUserAddresses.length; j++) {
      if (RegisteredUserAddresses[j] == _address) {
        return (true); // user is registered.
      }
    }
    return (false); // user is not registered.
  }
  
   function uint2str(uint v) public pure returns (string memory) {
        if(v == 0){
            return '0';
        }
        uint maxlength = 100;
        bytes memory reversed = new bytes(maxlength);
        uint i = 0;
        while (v != 0) {
            uint remainder = v % 10;
            v = v / 10;
            reversed[i++] = bytes1(uint8(48 + remainder));
        }
        bytes memory s = new bytes(i); // i + 1 is inefficient
        for (uint j = 0; j < i; j++) {
            s[j] = reversed[i - j - 1]; // to avoid the off-by-one error
        }
        string memory str = string(s);  // memory isn't implicitly convertible to storage
        return str;
    }
  
}