const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber, utils } = require("ethers");

describe("Community Keys", function () {
  let creator;
  let buyer1;
  let buyer2;
  let safeAddress;

  let communityKeysContract;

  beforeEach(async () => {
    [creator, buyer1, buyer2, safeAddress] = await ethers.getSigners();
  });

  it("Deployment should work", async function () {
    const action = ethers.deployContract("CommunityKeys");

    await expect(action).not.to.be.reverted;
  });

  const builder = async () => {
    return ethers.deployContract("CommunityKeys");
  };

  describe("functions", () => {
    beforeEach(async () => {
      communityKeysContract = await builder();
    });

    describe("createCommunity", () => {
      it("should create a community", async () => {
        const action = communityKeysContract.connect(creator).createCommunity(safeAddress.address, ethers.parseUnits("0.05", "ether"), "denites");

        await expect(action).not.to.be.reverted;
        const onchainName = await communityKeysContract.names(creator.address);
        expect(onchainName).to.equal("denites");
        const onchainFee = await communityKeysContract.fees(creator.address);
        expect(onchainFee).to.equal(5);
        const onchainSafeAddress = await communityKeysContract.safes(creator.address);
        expect(onchainSafeAddress).to.equal(safeAddress.address);
      });
    });

    describe("buyKey", () => {
      it("should buy a key", async () => {
        await communityKeysContract.connect(creator).createCommunity(safeAddress.address, ethers.parseUnits("0.05", "ether"), "denites");

        const price = await communityKeysContract.getBuyPrice(creator.address, 1);
        const action = communityKeysContract.connect(buyer1).buyKey(creator.address, { value: price });

        await expect(action).not.to.be.reverted;
        const onchainKeySupply = await communityKeysContract.communityKeys(creator.address, buyer1.address);
        expect(onchainKeySupply).to.equal(1);
      });
    });

    describe("sellKeys", () => {
      it("should sell a key", async () => {
        await communityKeysContract.connect(creator).createCommunity(safeAddress.address, ethers.parseUnits("0.05", "ether"), "denites");

        const firstPrice = await communityKeysContract.getBuyPrice(creator.address, 1);
        const firstPurchase = communityKeysContract.connect(buyer1).buyKey(creator.address, { value: firstPrice });
        await expect(firstPurchase).not.to.be.reverted;

        const secondPrice = await communityKeysContract.getBuyPrice(creator.address, 1);
        const secondPurchase = communityKeysContract.connect(buyer1).buyKey(creator.address, { value: secondPrice });
        await expect(secondPurchase).not.to.be.reverted;

        const onchainKeySupply = await communityKeysContract.communityKeys(creator.address, buyer1.address);
        expect(onchainKeySupply).to.equal(2);

        const sellAction = communityKeysContract.connect(buyer1).sellKeys(creator.address, 1);
        await expect(sellAction).not.to.be.reverted;

        const onchainKeySupplyAfter = await communityKeysContract.communityKeys(creator.address, buyer1.address);
        expect(onchainKeySupplyAfter).to.equal(1);
      });
    });

    describe("money transfers", () => {
      it("should transfer some fee to the safe", async () => {
        await communityKeysContract.connect(creator).createCommunity(safeAddress.address, ethers.parseUnits("0.05", "ether"), "denites");
        
        const balanceBefore = await ethers.provider.getBalance(safeAddress.address);

        const firstPrice = await communityKeysContract.getBuyPriceAfterFee(creator.address, 1);
        const firstPurchase = communityKeysContract.connect(buyer1).buyKey(creator.address, { value: firstPrice });
        await expect(firstPurchase).not.to.be.reverted;

        const secondPrice = await communityKeysContract.getBuyPriceAfterFee(creator.address, 1);
        const secondPurchase = communityKeysContract.connect(buyer1).buyKey(creator.address, { value: secondPrice });
        await expect(secondPurchase).not.to.be.reverted;

        const thirdPrice = await communityKeysContract.getBuyPriceAfterFee(creator.address, 1);
        const thirdPurchase = communityKeysContract.connect(buyer1).buyKey(creator.address, { value: thirdPrice });
        await expect(thirdPurchase).not.to.be.reverted;

        const balanceAfter = await ethers.provider.getBalance(safeAddress.address);

        expect(balanceAfter).to.be.greaterThan(balanceBefore);
      });
    });
  });
});
