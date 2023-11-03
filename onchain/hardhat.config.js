require("@nomicfoundation/hardhat-toolbox");

const INFURA_API_KEY = "KEY";
const SEPOLIA_PRIVATE_KEY = "YOUR SEPOLIA PRIVATE KEY";

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  }
};
