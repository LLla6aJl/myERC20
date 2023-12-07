import { task } from "hardhat/config"
import { ethers } from "hardhat"

const DECIMALS = 18
const NAME = "MyToken"
const SYMBOL = "MTK"
const INITIAL_AMOUNT = ethers.utils.parseEther("10")

task("getAllowance", "Get the allowance of a spender for a specific owner")
    .addParam("owner", "The address of the owner")
    .addParam("spender", "The address of the spender")
    .setAction(async ({ taskArguments, ethers }) => {
        const { owner, spender } = taskArguments
        const MyContract = await ethers.getContractFactory("ERC20Token")
        const myContract = await MyContract.deploy(NAME, SYMBOL, DECIMALS, INITIAL_AMOUNT)
        await myContract.deployed()

        const allowanceValue = await myContract.allowance(owner, spender)

        console.log(`Allowance of ${spender} for ${owner}: ${allowanceValue.toString()}`)
    })
