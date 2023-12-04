const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("ethers");

describe("BuyMeACoffee", function () {
    // Use loadFixture to deploy the contract before each test
    async function deployBuyMeACoffeeContract() {
        const BuyMeACoffee = await ethers.getContractFactory("BuyMeACoffee");
        const contract = await BuyMeACoffee.deploy();
        await contract.deployed();
        return contract;
    }

    it("should deploy and get owner address", async function () {
        const contract = await deployBuyMeACoffeeContract();
        const ownerAddress = await contract.owner();
        expect(ownerAddress).to.be.equal(await ethers.getSigner().getAddress());
    });

    it("should emit NewMemo event when buying coffee", async function () {
        const contract = await deployBuyMeACoffeeContract();
        const [owner, buyer] = await ethers.getSigners();

        const name = "John Doe";
        const message = "Thanks for the coffee!";

        const buyCoffeeTx = await contract.buyCoffee(name, message, {
            value: ethers.utils.parseEther("0.1"), // Send 0.1 ETH with the coffee purchase
        });

        // Wait for the transaction to be mined
        await buyCoffeeTx.wait();

        // Check event logs for emitted NewMemo event
        const events = await contract.queryFilter("NewMemo", 0, "latest");
        expect(events[0].args.from).to.be.equal(buyer.address);
        expect(events[0].args.name).to.be.equal(name);
        expect(events[0].args.message).to.be.equal(message);
    });

    it("should be able to withdraw tips", async function () {
        const contract = await deployBuyMeACoffeeContract();
        const [owner, buyer] = await ethers.getSigners();

        // Buy a coffee and send 0.2 ETH
        await contract.buyCoffee("Jane Doe", "Thanks for the coffee!", {
            value: ethers.utils.parseEther("0.2"),
        });

        // Get the initial contract balance
        const initialBalance = await contract.balance();

        // Withdraw tips as the owner
        await contract.withdrawTips();

        // Get the balance after withdrawing tips
        const finalBalance = await contract.balance();

        // Check that the balance decreased by the tip amount
        expect(initialBalance.sub(finalBalance)).to.be.equal(ethers.utils.parseEther("0.2"));
    });
});