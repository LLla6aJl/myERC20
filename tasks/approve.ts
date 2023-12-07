import { task } from "hardhat/config"
import { ethers } from "hardhat"

const DECIMALS = 18
const NAME = "MyToken"
const SYMBOL = "MTK"
const INITIAL_AMOUNT = ethers.utils.parseEther("10")

task("approveSpender", "Approve spender to spend tokens on behalf of the owner")
    .addParam("spender", "The address of the spender")
    .addParam("amount", "The amount of tokens to approve")
    .setAction(async ({ taskArguments, ethers }) => {
        const { spender, amount } = taskArguments
        const MyContract = await ethers.getContractFactory("ERC20Token")
        const myContract = await MyContract.deploy(NAME, SYMBOL, DECIMALS, INITIAL_AMOUNT)
        await myContract.deployed()

        const tx = await myContract.approve(spender, amount)

        await tx.wait()

        console.log(`Approved ${amount} tokens for spender ${spender}`)
    })
