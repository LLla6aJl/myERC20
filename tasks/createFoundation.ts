import { task } from "hardhat/config"

task("createFoundation", "Creates a Foundation")
  .addParam("donationReceiver", "The address of the donation receiver")
  .addParam("description", "Description of the Foundation")
  .setAction(async (taskArguments, { ethers }) => {
    const { donationReceiver, description } = taskArguments;
    const [sender] = await ethers.getSigners();

    const Foundation = await ethers.getContractFactory("Foundation");
    const foundation = await Foundation.deploy(donationReceiver, description, { value: ethers.utils.parseEther('1') });

    await foundation.deployed();

    console.log("Foundation created. Address:", foundation.address);
  });