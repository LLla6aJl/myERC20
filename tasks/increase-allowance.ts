import { task } from "hardhat/config"
import { ethers } from "hardhat"

const DECIMALS = 18
const NAME = "MyToken"
const SYMBOL = "MTK"
const INITIAL_AMOUNT = ethers.utils.parseEther("10")

task("increaseAllowance", "Increase the allowance for a spender")
    .addParam("spender", "The address of the spender")
    .addParam("addedValue", "The amount to increase the allowance by")
    .setAction(async (taskArguments, { ethers }) => {
        const { spender, addedValue } = taskArguments
        const MyContract = await ethers.getContractFactory("ERC20Token")
        const myContract = await MyContract.deploy(NAME, SYMBOL, DECIMALS, INITIAL_AMOUNT)
        await myContract.deployed()

        const tx = await myContract.increaseAllowance(spender, addedValue)

        await tx.wait()

        console.log(`Increased allowance for spender ${spender} by ${addedValue} tokens`)
    })
