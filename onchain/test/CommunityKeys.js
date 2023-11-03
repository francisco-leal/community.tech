const { expect } = require("chai");

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
        const action = communityKeysContract.connect(creator).createCommunity(safeAddress.address, 5, "denites");

        await expect(action).not.to.be.reverted;
        const onchainName = await communityKeysContract.names(creator.address);
        expect(onchainName).to.equal("denites");
        const onchainFee = await communityKeysContract.fees(creator.address);
        expect(onchainFee).to.equal(5);
        const onchainSafeAddress = await communityKeysContract.safes(creator.address);
        expect(onchainSafeAddress).to.equal(safeAddress.address);
      });
    });
  });
});
