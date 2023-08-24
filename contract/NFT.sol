// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFT is ERC721, Ownable {
    using Strings for uint256; // Importing the library for string manipulation

    uint public constant MAX_TOKENS = 32; // Maximum number of tokens that can be minted
    uint private constant TOKENS_RESERVED = 0; // Number of tokens reserved for special purposes
    uint public price = 1000000000000000; // Price in wei to mint each token
    uint256 public constant MAX_MINT_PER_ACCOUNT = 2; // Maximum number of tokens that can be minted per transaction

    bool public isSaleActive; // Flag to indicate if the sale is active
    uint256 public totalSupply; // Total number of tokens minted
    mapping(address => uint256) private mintedPerWallet; // Mapping to track the number of tokens minted per wallet address

    string public baseUri = "ipfs://bafybeiefb7s245y7wrtxkfg323xreayjxkplzgxq3kzwo6bu25eqlycciq/"; // Base URI for token metadata
    string public baseExtension = ".json"; // File extension for token metadata files

    constructor() ERC721("Gang", "GNG") { // Contract constructor
        for (uint256 i = 1; i <= TOKENS_RESERVED; ++i) { // Minting reserved tokens
            _safeMint(msg.sender, i); // Mint a token to the contract deployer
        }
        totalSupply = TOKENS_RESERVED; // Updating the total supply with reserved tokens
    }

    // Public Functions

    function mint(uint256 _numTokens) external payable { // Function to mint tokens
        require(isSaleActive, "The sale is paused."); // Sale must be active
        require(
            _numTokens == 1 || _numTokens == 2,
            "You can only mint 1 or 2 tokens at a time."
        ); // Only 1 or 2 tokens can be minted at a time
        require(
            mintedPerWallet[msg.sender] + _numTokens <= MAX_MINT_PER_ACCOUNT,
            "You cannot mint that many."
        ); // Total number of tokens minted by the sender cannot exceed the maximum per address
        uint256 curTotalSupply = totalSupply; // Current total supply of tokens
        require(
            curTotalSupply + _numTokens <= MAX_TOKENS,
            "Exceeds total supply."
        ); // Total supply cannot exceed the maximum allowed tokens
        require(_numTokens * price <= msg.value, "Insufficient funds."); // Sender must send enough ether to cover the minting cost

        for (uint256 i = 1; i <= _numTokens; ++i) { // Minting each token
            _safeMint(msg.sender, curTotalSupply + i); // Mint a token to the sender
        }
        mintedPerWallet[msg.sender] += _numTokens; // Updating the number of tokens minted by the sender
        totalSupply += _numTokens; // Updating the total supply
    }

    function getMintedCount(address walletAddress) public view returns (uint256) { // Function to get the number of tokens minted for a wallet address
        return mintedPerWallet[walletAddress];
    }

    // Owner-only functions

    function flipSaleState() external onlyOwner { // Function to toggle the sale state (active or paused)
        isSaleActive = !isSaleActive;
    }

    function setBaseUri(string memory _baseUri) external onlyOwner { // Function to set the base URI for token metadata
        baseUri = _baseUri;
    }

    function setPrice(uint256 _price) external onlyOwner { // Function to set the minting price for each token
        price = _price;
    }

    function withdrawAll() external payable onlyOwner { // Function to withdraw the contract's balance to two different addresses
        uint256 balance = address(this).balance;
        uint256 balanceOne = (balance * 70) / 100; // 70% of the contract's balance
        uint256 balanceTwo = (balance * 30) / 100; // 30% of the contract's balance
        (bool transferOne, ) = payable(
            msg.sender
        ).call{value: balanceOne}(""); // Transfer 70% of the balance to msg.sender
        (bool transferTwo, ) = payable(
            msg.sender
        ).call{value: balanceTwo}(""); // Transfer 30% of the balance to msg.sender

        require(transferOne && transferTwo, "Transfer failed."); // Both transfers must succeed
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) { // Function to get the token URI for a given token ID
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        ); // Token must exist

        string memory currentBaseURI = _baseURI(); // Get the base URI
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                ) // Concatenate the base URI, token ID, and file extension to get the full token URI
                : "";
    }

    function _baseURI() internal view virtual override returns (string memory) { // Internal function to get the base URI
        return baseUri;
    }
}