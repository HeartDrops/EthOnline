# BnktAuction

NFT Auction house

/**Notes \*/
/**
ERC1155 seems to have the latest functionality when it comes to minting nft or fractionalize. However this is a brand new tech and may not be compatible with
many of the current market.

\_mint can be used to create NFT or fungible tokens by changing the supply to 1 - NFT, > 1 fungible toknes.
its mandatory to also include a URI ( json format ) which contains the name, description, Image and other params when minting. Probabaly need to integrae IPFS
to store the JSON data. or we can store it directly in structs and the image in IPFS.

----------------- if not using ERC 1155 ------------------------
ERC 721 can be used to create the NFT which is what opensea uses and so does other NFT sites. which means we can connect to third party sites if need be ( prob not for demo)
same with ERC 20 industry standard or we can use ERC777 which is ERC20 with better safegaurds.

/\*\* after user connects wallet to web3 and gets access to website.
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

\*/
