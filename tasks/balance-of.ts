import { task } from "hardhat/config"
import { ethers } from "hardhat"

const DECIMALS = 18
const NAME = "MyToken"
const SYMBOL = "MTK"
const INITIAL_AMOUNT = ethers.utils.parseEther("10")

task("getBalance", "Get the balance of an account in the token contract")
    .addParam("accountAddress", "The address of the account to check")
    .setAction(async (taskArguments, { ethers }) => {
        const { accountAddress } = taskArguments
        const MyContract = await ethers.getContractFactory("ERC20Token")
        const myContract = await MyContract.deploy(NAME, SYMBOL, DECIMALS, INITIAL_AMOUNT)
        await myContract.deployed()
        const balance = await myContract.balanceOf(accountAddress)

        console.log(`Balance of ${accountAddress}: ${balance.toString()}`)
    })
