import { task } from "hardhat/config"
import { ethers } from "hardhat"

const DECIMALS = 18
const NAME = "MyToken"
const SYMBOL = "MTK"
const INITIAL_AMOUNT = ethers.utils.parseEther("10")

task("mintTokens", "Mint new tokens and assign them to an account")
    .addParam("account", "The address to which new tokens will be minted")
    .addParam("amount", "The amount of tokens to mint")
    .setAction(async (taskArguments, { ethers }) => {
        const { amount, account } = taskArguments
        const MyContract = await ethers.getContractFactory("ERC20Token")
        const myContract = await MyContract.deploy(NAME, SYMBOL, DECIMALS, INITIAL_AMOUNT)
        await myContract.deployed()

        const tx = await myContract.mint(account, amount)

        await tx.wait()

        console.log(`Minted ${amount} tokens to ${account}`)
    })
