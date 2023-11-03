require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");

const INFURA_API_KEY = "KEY";
const SEPOLIA_PRIVATE_KEY = "0x1111111111111111111111111111111111111111111111111111111111111111";
const COREDAO_PRIVATE_KEY = "0x1111111111111111111111111111111111111111111111111111111111111111";

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    },
    coreDaoTestnet: {
      url: "https://rpc.test.btcs.network/",
      accounts: [COREDAO_PRIVATE_KEY]
    }
  }
};
