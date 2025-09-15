
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CertificateNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Certificate data structure
    struct Certificate {
        string certificateId;
        string recipientName;
        string courseName;
        string issueDate;
        address recipient;
        bool isValid;
    }
    
    // Mapping from token ID to certificate data
    mapping(uint256 => Certificate) public certificates;
    
    // Mapping from certificate ID to token ID (to prevent duplicate certificate IDs)
    mapping(string => uint256) public certificateIdToTokenId;
    
    // Events
    event CertificateIssued(
        uint256 indexed tokenId,
        string certificateId,
        address indexed recipient,
        string recipientName,
        string courseName
    );
    
    event CertificateRevoked(uint256 indexed tokenId, string certificateId);
    
    constructor() ERC721("Certificate NFT", "CERT") {}
    
    /**
     * @dev Issues a new certificate NFT
     * @param recipient The address that will receive the certificate
     * @param certificateId Unique identifier for the certificate
     * @param recipientName Name of the certificate recipient
     * @param courseName Name of the course/program
     * @param issueDate Date when certificate was issued
     * @param tokenURI Metadata URI for the NFT
     */
    function issueCertificate(
        address recipient,
        string memory certificateId,
        string memory recipientName,
        string memory courseName,
        string memory issueDate,
        string memory tokenURI
    ) public onlyOwner {
        require(recipient != address(0), "Invalid recipient address");
        require(bytes(certificateId).length > 0, "Certificate ID cannot be empty");
        require(certificateIdToTokenId[certificateId] == 0, "Certificate ID already exists");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        // Store certificate data
        certificates[tokenId] = Certificate({
            certificateId: certificateId,
            recipientName: recipientName,
            courseName: courseName,
            issueDate: issueDate,
            recipient: recipient,
            isValid: true
        });
        
        // Map certificate ID to token ID (add 1 to avoid 0 default value)
        certificateIdToTokenId[certificateId] = tokenId + 1;
        
        // Mint the NFT
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        emit CertificateIssued(tokenId, certificateId, recipient, recipientName, courseName);
    }
    
    /**
     * @dev Verifies if a wallet owns a valid certificate
     * @param walletAddress The wallet address to verify
     * @param certificateId The certificate ID to check
     * @return bool True if the wallet owns the valid certificate
     */
    function verifyCertificate(address walletAddress, string memory certificateId) 
        public view returns (bool) {
        uint256 mappedTokenId = certificateIdToTokenId[certificateId];
        if (mappedTokenId == 0) {
            return false; // Certificate ID doesn't exist
        }
        
        uint256 tokenId = mappedTokenId - 1; // Subtract 1 to get actual token ID
        
        return ownerOf(tokenId) == walletAddress && 
               certificates[tokenId].isValid;
    }
    
    /**
     * @dev Gets certificate details by certificate ID
     * @param certificateId The certificate ID to look up
     * @return Certificate data structure
     */
    function getCertificateById(string memory certificateId) 
        public view returns (Certificate memory) {
        uint256 mappedTokenId = certificateIdToTokenId[certificateId];
        require(mappedTokenId > 0, "Certificate not found");
        
        uint256 tokenId = mappedTokenId - 1;
        return certificates[tokenId];
    }
    
    /**
     * @dev Gets certificate details by token ID
     * @param tokenId The token ID to look up
     * @return Certificate data structure
     */
    function getCertificateByTokenId(uint256 tokenId) 
        public view returns (Certificate memory) {
        require(_exists(tokenId), "Token does not exist");
        return certificates[tokenId];
    }
    
    /**
     * @dev Gets all certificate token IDs owned by an address
     * @param owner The wallet address to check
     * @return Array of token IDs
     */
    function getCertificatesByOwner(address owner) 
        public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);
        uint256 currentIndex = 0;
        
        uint256 totalSupply = _tokenIdCounter.current();
        
        for (uint256 i = 0; i < totalSupply; i++) {
            if (_exists(i) && ownerOf(i) == owner) {
                tokenIds[currentIndex] = i;
                currentIndex++;
            }
        }
        
        return tokenIds;
    }
    
    /**
     * @dev Revokes a certificate (marks as invalid)
     * @param certificateId The certificate ID to revoke
     */
    function revokeCertificate(string memory certificateId) 
        public onlyOwner {
        uint256 mappedTokenId = certificateIdToTokenId[certificateId];
        require(mappedTokenId > 0, "Certificate not found");
        
        uint256 tokenId = mappedTokenId - 1;
        certificates[tokenId].isValid = false;
        
        emit CertificateRevoked(tokenId, certificateId);
    }
    
    /**
     * @dev Gets the total number of certificates issued
     */
    function getTotalCertificates() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) 
        public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) 
        public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}