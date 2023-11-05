const { ethers } = require("hardhat");
const CommunityKeysArtifact = require("../artifacts/contracts/CommunityKeys.sol/CommunityKeys.json");

async function main() {
  const [deployer] = await ethers.getSigners();

  const address = "0x4275854fDEF5EE848a2F9F9e10f17119E285A498";
  const contract = new ethers.Contract(address, CommunityKeysArtifact.abi, deployer);

  const createTx = await contract.connect(deployer).createCommunity(deployer.address, ethers.parseUnits("0.05", "ether"), "denites");
  await createTx.wait();

  let price = await contract.getBuyPriceAfterFee("denites", 1);
  const buy1 = await contract.connect(deployer).buyKey("denites", { value: price });
  let receipt = await buy1.wait();
  console.log("receipt", receipt.hash);

  price = await contract.getBuyPriceAfterFee("denites", 1);
  const buy2 = await contract.connect(deployer).buyKey("denites", { value: price });
  receipt = await buy2.wait();
  console.log("receipt", receipt.hash);

  price = await contract.getBuyPriceAfterFee("denites", 1);
  const buy3 = await contract.connect(deployer).buyKey("denites", { value: price });
  receipt = await buy3.wait();
  console.log("receipt", receipt.hash);
  
  const sell = await contract.connect(deployer).sellKeys("denites", 1);
  receipt = await sell.wait();
  console.log("receipt", receipt.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
