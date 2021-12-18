import { expect } from "chai";
import { BigNumber, utils } from "ethers";
import { ethers } from "hardhat";

describe("General tests", function () {
  it("Basic functionality", async () => {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    const TheNft = await ethers.getContractFactory('NFT');

    let theContract = await TheNft.deploy("The one and only NFT", 'TOAON', 'https://baseuri', 'https://revealeduri');

    // Deploy contract
    await theContract.deployed();

    // Mint 1 with owner's address
    await theContract.connect(owner);
    const mint1 = await theContract.mint(1);

    // Mint 13 with address 1
    const mint2 = await theContract.connect(addr1).mint(10, {value: utils.parseEther('0.5')});
    const mint3 = await theContract.connect(addr1).mint(3, {value: utils.parseEther('0.15')});

    // Mint 6 with address 2
    const mint4 = await theContract.connect(addr2).mint(6, {value: utils.parseEther('0.3')});

    await mint1.wait();
    await mint2.wait();
    await mint3.wait();
    await mint4.wait();

    expect(await theContract.totalSupply()).to.equal(20);

    expect(await (await theContract.walletOfOwner(owner.address)).map((bigNumber: BigNumber) => bigNumber.toNumber())).to.deep.equal([
      1,
    ]);

    expect(await (await theContract.walletOfOwner(addr1.address)).map((bigNumber: BigNumber) => bigNumber.toNumber())).to.deep.equal([
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
    ]);

    expect(await (await theContract.walletOfOwner(addr2.address)).map((bigNumber: BigNumber) => bigNumber.toNumber())).to.deep.equal([
      15,
      16,
      17,
      18,
      19,
      20,
    ]);

    expect(await (await theContract.walletOfOwner(addr3.address)).map((bigNumber: BigNumber) => bigNumber.toNumber())).to.deep.equal([]);
  });
});