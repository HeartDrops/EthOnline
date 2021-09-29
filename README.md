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

\*/
