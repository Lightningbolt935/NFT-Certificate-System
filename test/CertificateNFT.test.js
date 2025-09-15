const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateNFT", function () {
  let certificateNFT;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const CertificateNFT = await ethers.getContractFactory("CertificateNFT");
    certificateNFT = await CertificateNFT.deploy();
    await certificateNFT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await certificateNFT.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await certificateNFT.name()).to.equal("Certificate NFT");
      expect(await certificateNFT.symbol()).to.equal("CERT");
    });
  });

  describe("Certificate Issuance", function () {
    it("Should issue a certificate successfully", async function () {
      const certificateId = "CERT-2024-001";
      const recipientName = "John Doe";
      const courseName = "Blockchain Basics";
      const issueDate = "2024-09-07";
      const tokenURI = "https://example.com/metadata/1";

      await certificateNFT.issueCertificate(
        addr1.address,
        certificateId,
        recipientName,
        courseName,
        issueDate,
        tokenURI
      );

      // Check if certificate exists
      const certificate = await certificateNFT.getCertificateById(certificateId);
      expect(certificate.certificateId).to.equal(certificateId);
      expect(certificate.recipientName).to.equal(recipientName);
      expect(certificate.courseName).to.equal(courseName);
      expect(certificate.recipient).to.equal(addr1.address);
      expect(certificate.isValid).to.be.true;

      // Check if NFT was minted
      expect(await certificateNFT.balanceOf(addr1.address)).to.equal(1);
      expect(await certificateNFT.ownerOf(0)).to.equal(addr1.address);
    });

    it("Should prevent duplicate certificate IDs", async function () {
      const certificateId = "CERT-2024-001";

      await certificateNFT.issueCertificate(
        addr1.address,
        certificateId,
        "John Doe",
        "Course 1",
        "2024-09-07",
        "https://example.com/1"
      );

      await expect(
        certificateNFT.issueCertificate(
          addr2.address,
          certificateId,
          "Jane Doe",
          "Course 2",
          "2024-09-07",
          "https://example.com/2"
        )
      ).to.be.revertedWith("Certificate ID already exists");
    });

    it("Should only allow owner to issue certificates", async function () {
      await expect(
        certificateNFT.connect(addr1).issueCertificate(
          addr2.address,
          "CERT-2024-001",
          "John Doe",
          "Course 1",
          "2024-09-07",
          "https://example.com/1"
        )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should emit CertificateIssued event", async function () {
      const certificateId = "CERT-2024-001";
      const recipientName = "John Doe";
      const courseName = "Blockchain Basics";

      await expect(
        certificateNFT.issueCertificate(
          addr1.address,
          certificateId,
          recipientName,
          courseName,
          "2024-09-07",
          "https://example.com/1"
        )
      )
        .to.emit(certificateNFT, "CertificateIssued")
        .withArgs(0, certificateId, addr1.address, recipientName, courseName);
    });
  });

  describe("Certificate Verification", function () {
    beforeEach(async function () {
      await certificateNFT.issueCertificate(
        addr1.address,
        "CERT-2024-001",
        "John Doe",
        "Course 1",
        "2024-09-07",
        "https://example.com/1"
      );
    });

    it("Should verify valid certificate", async function () {
      const isValid = await certificateNFT.verifyCertificate(
        addr1.address,
        "CERT-2024-001"
      );
      expect(isValid).to.be.true;
    });

    it("Should return false for invalid certificate ID", async function () {
      const isValid = await certificateNFT.verifyCertificate(
        addr1.address,
        "CERT-2024-999"
      );
      expect(isValid).to.be.false;
    });

    it("Should return false for wrong wallet address", async function () {
      const isValid = await certificateNFT.verifyCertificate(
        addr2.address,
        "CERT-2024-001"
      );
      expect(isValid).to.be.false;
    });
  });

  describe("Certificate Management", function () {
    beforeEach(async function () {
      await certificateNFT.issueCertificate(
        addr1.address,
        "CERT-2024-001",
        "John Doe",
        "Course 1",
        "2024-09-07",
        "https://example.com/1"
      );

      await certificateNFT.issueCertificate(
        addr1.address,
        "CERT-2024-002",
        "John Doe",
        "Course 2",
        "2024-09-07",
        "https://example.com/2"
      );
    });

    it("Should get certificates by owner", async function () {
      const tokenIds = await certificateNFT.getCertificatesByOwner(addr1.address);
      expect(tokenIds.length).to.equal(2);
      expect(tokenIds[0]).to.equal(0);
      expect(tokenIds[1]).to.equal(1);
    });

    it("Should get certificate by token ID", async function () {
      const certificate = await certificateNFT.getCertificateByTokenId(0);
      expect(certificate.certificateId).to.equal("CERT-2024-001");
      expect(certificate.recipientName).to.equal("John Doe");
    });

    it("Should revoke certificate", async function () {
      await certificateNFT.revokeCertificate("CERT-2024-001");

      const certificate = await certificateNFT.getCertificateById("CERT-2024-001");
      expect(certificate.isValid).to.be.false;

      const isValid = await certificateNFT.verifyCertificate(
        addr1.address,
        "CERT-2024-001"
      );
      expect(isValid).to.be.false;
    });

    it("Should emit CertificateRevoked event", async function () {
      await expect(certificateNFT.revokeCertificate("CERT-2024-001"))
        .to.emit(certificateNFT, "CertificateRevoked")
        .withArgs(0, "CERT-2024-001");
    });

    it("Should get total certificates count", async function () {
      const total = await certificateNFT.getTotalCertificates();
      expect(total).to.equal(2);
    });
  });

  describe("Edge Cases", function () {
    it("Should reject empty certificate ID", async function () {
      await expect(
        certificateNFT.issueCertificate(
          addr1.address,
          "",
          "John Doe",
          "Course 1",
          "2024-09-07",
          "https://example.com/1"
        )
      ).to.be.revertedWith("Certificate ID cannot be empty");
    });

    it("Should reject zero address recipient", async function () {
      await expect(
        certificateNFT.issueCertificate(
          ethers.ZeroAddress,
          "CERT-2024-001",
          "John Doe",
          "Course 1",
          "2024-09-07",
          "https://example.com/1"
        )
      ).to.be.revertedWith("Invalid recipient address");
    });

    it("Should revert when getting non-existent certificate", async function () {
      await expect(
        certificateNFT.getCertificateById("NON-EXISTENT")
      ).to.be.revertedWith("Certificate not found");
    });

    it("Should revert when revoking non-existent certificate", async function () {
      await expect(
        certificateNFT.revokeCertificate("NON-EXISTENT")
      ).to.be.revertedWith("Certificate not found");
    });
  });
});