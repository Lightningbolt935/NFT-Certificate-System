#NFT CERTIFICATE SYSTEM
A blockchain-based certificate verification system using NFTs (Non-Fungible Tokens) built on Ethereum. This system allows authorities to issue tamper-proof digital certificates and enables instant verification of certificate authenticity.
# Features

Issue Certificates: Authority can mint certificate NFTs with unique identifiers
Verify Certificates: Anyone can verify certificate authenticity on-chain
Immutable Records: Certificates are stored permanently on the blockchain
User Dashboard: View all certificates owned by a wallet address
Certificate Details: Complete information including recipient, course, and issue date
Revocation System: Authority can revoke certificates if needed

#Tech Stack

Smart Contract: Solidity ^0.8.19
Blockchain: Ethereum (Sepolia/Goerli Testnet)
Development Framework: Hardhat
Frontend: React.js with ethers.js
Wallet Integration: MetaMask
Standards: ERC-721 NFT Standard with OpenZeppelin

#Installation & Setup
Prerequisites

Node.js v16+ and npm
MetaMask browser extension
Test ETH for gas fees (get from faucet)

1. Clone and Install Dependencies
bashgit clone <your-repo-url>
cd certificate-nft-system
npm install
2. Environment Setup
Create a .env file in the root directory:
envPRIVATE_KEY=your_wallet_private_key_here
SEPOLIA_URL=https://rpc.sepolia.org
ETHERSCAN_API_KEY=your_etherscan_api_key
3. Compile Smart Contract
bashnpx hardhat compile
4. Deploy to Testnet
bash# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# Deploy to Goerli
npx hardhat run scripts/deploy.js --network goerli
5. Setup Frontend
bashcd frontend
npm install
Update CONTRACT_ADDRESS in frontend/src/App.js with your deployed contract address.
6. Run Frontend
bashnpm start
 Smart Contract Functions
Core Functions
solidity// Issue a new certificate (Owner only)
function issueCertificate(
    address recipient,
    string memory certificateId,
    string memory recipientName,
    string memory courseName,
    string memory issueDate,
    string memory tokenURI
) public onlyOwner

// Verify if a wallet owns a specific certificate
function verifyCertificate(
    address walletAddress, 
    string memory certificateId
) public view returns (bool)

// Get certificate details by ID
function getCertificateById(string memory certificateId) 
    public view returns (Certificate memory)

// Get all certificates owned by an address
function getCertificatesByOwner(address owner) 
    public view returns (uint256[] memory)

// Revoke a certificate
function revokeCertificate(string memory certificateId) 
    public onlyOwner
 Testing & Demo
1. Issue Sample Certificates
After deployment, the script automatically issues two sample certificates. You can also manually issue certificates through the frontend if you're the contract owner.
2. Verify Certificates
Use the verification form to check if a wallet owns a specific certificate:

Enter wallet address
Enter certificate ID
Click "Verify Certificate"

3. View User Certificates
Connect your wallet to see all certificates you own displayed in a grid layout.
 Demo Checklist
Smart Contract Deployment: Contract deployed on testnet
 Certificate Issuance: Issue certificates to 2 different wallets
 Certificate Verification: Verify certificates are valid and owned by correct wallets
 Immutability Proof: Show that certificates cannot be modified once issued
 Frontend Integration: Working web interface for all operations

#Security Features

Access Control: Only contract owner can issue certificates
Unique IDs: Prevents duplicate certificate IDs
Immutable Records: Certificates cannot be edited once issued
On-chain Verification: No trusted third parties needed
Revocation System: Authority can revoke certificates if needed

# Deployed Contract Details
Sepolia Testnet

Contract Address: [UPDATE_WITH_YOUR_ADDRESS]
Network: Sepolia Testnet (Chain ID: 11155111)
Explorer: https://sepolia.etherscan.io/address/[YOUR_ADDRESS]


# Development Commands
bash# Compile contracts
npm run compile

# Deploy to localhost
npm run deploy:localhost

# Deploy to Sepolia
npm run deploy:sepolia

# Run tests
npm run test

# Verify contract on Etherscan
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS

# Start frontend development server
npm run dev
 Frontend Usage
For Certificate Authority (Owner)

Connect wallet (must be contract owner)
Fill in certificate details in "Issue Certificate" form
Submit transaction and wait for confirmation
Certificate is minted as NFT to recipient's wallet

For Certificate Verification

Enter wallet address and certificate ID in verification form
Click "Verify Certificate"
See instant verification result and certificate details

For Certificate Holders

Connect wallet to see your certificates
View all owned certificates with full details
Share certificate ID for others to verify

 Troubleshooting
Common Issues

"Contract not deployed": Update CONTRACT_ADDRESS in App.js
"MetaMask not connected": Install MetaMask and connect wallet
"Transaction failed": Ensure you have enough test ETH for gas
"Network mismatch": Switch MetaMask to the correct testnet

Getting Test ETH

Sepolia: https://sepoliafaucet.com/
Goerli: https://goerlifaucet.com/

 Contributing

Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

 License
This project is licensed under the MIT License - see the LICENSE file for details.
