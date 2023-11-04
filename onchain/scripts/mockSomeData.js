const { ethers } = require("hardhat");
const CommunityKeysArtifact = require("../artifacts/contracts/CommunityKeys.sol/CommunityKeys.json");

async function main() {
  const [deployer] = await ethers.getSigners();

  const address = "0x664d86CF8D30EEC4169393a70EB3aa796BE85642";
  const contract = new ethers.Contract(address, CommunityKeysArtifact.abi, deployer);

  // const createTx = await contract.connect(deployer).createCommunity(deployer.address, ethers.parseUnits("0.05", "ether"), "denites");
  // await createTx.wait();

  let price = await contract.getBuyPriceAfterFee("denites", 1);
  const buy1 = await contract.connect(deployer).buyKey("denites", { value: price });
  await buy1.wait();

  price = await contract.getBuyPriceAfterFee("denites", 1);
  const buy2 = await contract.connect(deployer).buyKey("denites", { value: price });
  await buy2.wait();

  price = await contract.getBuyPriceAfterFee("denites", 1);
  const buy3 = await contract.connect(deployer).buyKey("denites", { value: price });
  await buy3.wait();

  console.log("contract address:", await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });