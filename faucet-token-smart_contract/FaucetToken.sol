// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EnhancedFaucetToken is ERC20, Ownable {
    // Struct to hold the CosmosHub-Ethereum address mapping
    struct AddressMapping {
        address ethereumAddress;
        bool hasClaimed;
    }

    // Mapping of CosmosHub addresses to their corresponding Ethereum address
    mapping(string => AddressMapping) private cosmosToEthMapping;

    // Mapping of Ethereum addresses to CosmosHub addresses for reverse lookup
    mapping(address => string) private ethToCosmosMapping;

    // Event to log faucet claims
    event FaucetClaimed(address indexed ethereumAddress, string cosmosAddress);

    // Constructor to set the token name and symbol, and mint initial tokens to the owner
    constructor() ERC20("FaucetToken", "FTK") Ownable(msg.sender) { //msg.sender = the address deploying the contract
        _mint(msg.sender, 1000 * 10 ** decimals()); // Mint 1,000,000 tokens to the contract owner
    }

    // Function to distribute tokens through the faucet
    function faucet(address _ethereumAddress, string memory _cosmosAddress) external onlyOwner {
        require(bytes(_cosmosAddress).length > 0, "CosmosHub address is required");
        require(cosmosToEthMapping[_cosmosAddress].hasClaimed == false, "Claim already made for this CosmosHub address");

        // Transfer 10 tokens to the provided Ethereum address
        _transfer(owner(), _ethereumAddress, 10 * 10 ** decimals());

        // Store the CosmosHub to Ethereum address mapping
        cosmosToEthMapping[_cosmosAddress] = AddressMapping({
            ethereumAddress: _ethereumAddress,
            hasClaimed: true
        });

        // Store the reverse mapping of Ethereum address to CosmosHub address
        ethToCosmosMapping[_ethereumAddress] = _cosmosAddress;

        emit FaucetClaimed(_ethereumAddress, _cosmosAddress);
    }

    // Getter function to check if a CosmosHub address has already claimed tokens
    function hasClaimed(string memory _cosmosAddress) external view returns (bool) {
        return cosmosToEthMapping[_cosmosAddress].hasClaimed;
    }

    // Modifier to check if an Ethereum address is authorized for transfers
    modifier onlyAuthorized(address _ethereumAddress) {
        require(isAuthorized(_ethereumAddress), "Transfer to this address is not authorized");
        _;
    }

    // Custom transfer function that applies the onlyAuthorized modifier
    function transfer(address recipient, uint256 amount) public override onlyAuthorized(recipient) returns (bool) {
        return super.transfer(recipient, amount);
    }

    // Custom transferFrom function that applies the onlyAuthorized modifier
    function transferFrom(address sender, address recipient, uint256 amount) public override onlyAuthorized(recipient) returns (bool) {
        return super.transferFrom(sender, recipient, amount);
    }

    // Helper function to check if an Ethereum address is authorized for transfers
    function isAuthorized(address _ethereumAddress) internal view returns (bool) {
        // Check if there is a CosmosHub address associated with this Ethereum address
        return bytes(ethToCosmosMapping[_ethereumAddress]).length > 0;
    }
}

