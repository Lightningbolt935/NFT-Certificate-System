
// Use the Hardhat Runtime Environment (HRE) pattern
async function main(hre) {
    const { ethers } = hre;
    console.log("Deploying Certificate NFT contract...");
    
    // Get the contract factory
    const CertificateNFT = await ethers.getContractFactory("CertificateNFT");
    
    // Deploy the contract
    const certificateNFT = await CertificateNFT.deploy();
    await certificateNFT.waitForDeployment();
    
    const contractAddress = await certificateNFT.getAddress();
    console.info("Certificate NFT deployed to:", contractAddress);
    
    // fs.writeFileSync('./contract-address.js', `export const CONTRACT_ADDRESS = "${contractAddress}";`);
    // console.log("Contract address written to contract-address.js");
    
    // Wait for a few block confirmations
    console.info("Waiting for block confirmations...");
    await certificateNFT.deploymentTransaction().wait(6);
    
    console.log("Contract deployed successfully!");
    
    // Issue sample certificates
    console.log("\nIssuing sample certificates...");
    
    const [deployer] = await ethers.getSigners();
    console.log("Deployer address:", deployer.address);
    
    // Sample recipient addresses (you'll need to replace these with actual addresses)
    const recipient1 = "0x742d35Cc6634C0532925a3b8D7389B2D9e434C1C"; // Replace with actual address
    const recipient2 = "0x8ba1f109551bd432803012645Hac136c0C86FBBC"; // Replace with actual address
    
    try {
        // Issue first certificate
        const tx1 = await certificateNFT.issueCertificate(
            recipient1,
            "CERT-2024-001",
            "Alice Johnson",
            "Blockchain Development Fundamentals",
            "2024-09-07",
            "https://ipfs.io/ipfs/QmYourHashHere1" // Replace with actual IPFS hash
        );
        await tx1.wait();
        console.log("Certificate 1 issued to:", recipient1);
        
        // Issue second certificate
        const tx2 = await certificateNFT.issueCertificate(
            recipient2,
            "CERT-2024-002", 
            "Bob Smith",
            "Smart Contract Security",
            "2024-09-07",
            "https://ipfs.io/ipfs/QmYourHashHere2" // Replace with actual IPFS hash
        );
        await tx2.wait();
        console.log("Certificate 2 issued to:", recipient2);
        
        console.log("\nSample certificates issued successfully!");
        
        // Verify certificates
        console.log("\nVerifying certificates...");
        const isValid1 = await certificateNFT.verifyCertificate(recipient1, "CERT-2024-001");
        const isValid2 = await certificateNFT.verifyCertificate(recipient2, "CERT-2024-002");
        
        console.log("Certificate CERT-2024-001 is valid:", isValid1);
        console.log("Certificate CERT-2024-002 is valid:", isValid2);
        
    } catch (error) {
        console.log("Sample certificate issuance skipped (replace recipient addresses first)");
        console.log("Error:", error.message);
    }
    
    console.log("\n=== Deployment Summary ===");
    console.log("Contract Address:", contractAddress);
    console.log("Network:", (await ethers.provider.getNetwork()).name);
    console.log("Deployer:", deployer.address);
    console.log("Total certificates issued:", await certificateNFT.getTotalCertificates());
}



export default main;