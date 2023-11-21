import { task } from "hardhat/config"

task("transferFundsToReceiver", "Transfers funds to a Foundation")
  .addParam("foundationAddress", "The address of the Foundation")
  .addParam("amount", "The amount of funds to transfer")
  .setAction(async (taskArguments, { ethers }) => {
    const { foundationAddress, amount } = taskArguments;
    const FundManager = await ethers.getContractFactory("FundManager");
    const fundManager = await FundManager.deploy();
    await fundManager.deployed();

    const transferTx = await fundManager.transferFundsToReceiver(foundationAddress, amount);

    await transferTx.wait();

    console.log(`Funds transferred to Foundation at Receiver. Amount: ${amount}`);
  });