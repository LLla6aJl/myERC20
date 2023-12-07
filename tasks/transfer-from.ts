import { task } from "hardhat/config"
import { ethers } from "hardhat"

const DECIMALS = 18
const NAME = "MyToken"
const SYMBOL = "MTK"
const INITIAL_AMOUNT = ethers.utils.parseEther("10")

task("transferTokensFrom", "Transfer tokens from one address to another using allowance")
    .addParam("from", "The address from which tokens will be transferred")
    .addParam("to", "The address to which tokens will be transferred")
    .addParam("amount", "The amount of tokens to transfer")
    .setAction(async ({ taskArguments, ethers }) => {
        const { amount, to, from } = taskArguments
        const MyContract = await ethers.getContractFactory("ERC20Token")
        const myContract = await MyContract.deploy(NAME, SYMBOL, DECIMALS, INITIAL_AMOUNT)
        await myContract.deployed()

        const tx = await myContract.transferFrom(from, to, amount)

        await tx.wait()

        console.log(`Transferred ${amount} tokens from ${from} to ${to}`)
    })
