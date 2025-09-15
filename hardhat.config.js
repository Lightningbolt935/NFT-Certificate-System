import dotenv from "dotenv";
dotenv.config();



/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: {
    compilers: [
      { version: "0.8.19" },
      { version: "0.8.0" },
      { version: "0.8.1" }
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8546",
      chainId: 1337,
      type: "http"
    },
    sepolia: {
      url: process.env.SEPOLIA_URL || "https://rpc.sepolia.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
      type: "http"
    },
    goerli: {
      url: process.env.GOERLI_URL || "https://rpc.goerli.mudit.blog",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 5,
      type: "http"
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }

};

export default config;





