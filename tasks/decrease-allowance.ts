import { task } from "hardhat/config"
import { ethers } from "hardhat"

const DECIMALS = 18
const NAME = "MyToken"
const SYMBOL = "MTK"
const INITIAL_AMOUNT = ethers.utils.parseEther("10")

task("decreaseAllowance", "Decrease  the allowance for a spender")
    .addParam("spender", "The address of the spender")
    .addParam("subtractedValue", "The amount to decrease the allowance by")
    .setAction(async (taskArguments, { ethers }) => {
        const { spender, subtractedValue } = taskArguments
        const MyContract = await ethers.getContractFactory("ERC20Token")
        const myContract = await MyContract.deploy(NAME, SYMBOL, DECIMALS, INITIAL_AMOUNT)
        await myContract.deployed()

        const tx = await myContract.decreaseAllowance(spender, subtractedValue)

        await tx.wait()

        console.log(`Decreased allowance for spender ${spender} by ${subtractedValue} tokens`)
    })
