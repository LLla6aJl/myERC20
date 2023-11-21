import { task } from "hardhat/config"

task("updateFoundationDescription", "Updates the description of a Foundation")
  .addParam("foundationAddress", "The address of the Foundation")
  .addParam("description", "The new description for the Foundation")
  .setAction(async (taskArguments, { ethers }) => {
    const { foundationAddress, description } = taskArguments;
    const FundManager = await ethers.getContractFactory("FundManager");
    const fundManager = await FundManager.deploy();
    await fundManager.deployed();

    const updateTx = await fundManager.updateFoundationDescription(foundationAddress, description);
    await updateTx.wait();

    console.log(`Foundation description updated for ${foundationAddress}. New description: ${description}`);
  });