const { expect } = require("chai");

describe("Community Keys", function () {
  it("Deployment should work", async function () {
    const action = ethers.deployContract("CommunityKeys");

    await expect(action).not.to.be.reverted;
  });
});
