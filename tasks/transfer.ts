import { task } from "hardhat/config"
import { ethers } from "hardhat"

const DECIMALS = 18
const NAME = "MyToken"
const SYMBOL = "MTK"
const INITIAL_AMOUNT = ethers.utils.parseEther("10")

task("transferTokens", "Transfer tokens to a recipient")
    .addParam("recipient", "The address of the recipient")
    .addParam("amount", "The amount of tokens to transfer")
    .setAction(async ({ taskArguments, ethers }) => {
        const { recipient, amount } = taskArguments
        const MyContract = await ethers.getContractFactory("ERC20Token")
        const myContract = await MyContract.deploy(NAME, SYMBOL, DECIMALS, INITIAL_AMOUNT)
        await myContract.deployed()

        const tx = await myContract.transfer(recipient, amount)
        await tx.wait()

        console.log(`Transferred ${amount} tokens to ${recipient}`)
    })
