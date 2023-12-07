import { task } from "hardhat/config"
import { ethers } from "hardhat"

const DECIMALS = 18
const NAME = "MyToken"
const SYMBOL = "MTK"
const INITIAL_AMOUNT = ethers.utils.parseEther("10")

task("burnTokens", "Burn tokens from an account")
    .addParam("account", "The address from which tokens will be burned")
    .addParam("amount", "The amount of tokens to burn")
    .setAction(async ({ taskArguments, ethers }) => {
        const { amount, account } = taskArguments
        const MyContract = await ethers.getContractFactory("ERC20Token")
        const myContract = await MyContract.deploy(NAME, SYMBOL, DECIMALS, INITIAL_AMOUNT)
        await myContract.deployed()

        const tx = await myContract.burn(account, amount)

        await tx.wait()

        console.log(`Burned ${amount} tokens from ${account}`)
    })
