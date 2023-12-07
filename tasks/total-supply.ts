import { task } from "hardhat/config"
import { ethers } from "hardhat"

const DECIMALS = 18
const NAME = "MyToken"
const SYMBOL = "MTK"
const INITIAL_AMOUNT = ethers.utils.parseEther("10")

task("getTotalSupply", "Get the total supply of the token").setAction(async ({ ethers }) => {
    const MyContract = await ethers.getContractFactory("ERC20Token")
    const myContract = await MyContract.deploy(NAME, SYMBOL, DECIMALS, INITIAL_AMOUNT)
    await myContract.deployed()
    const totalSupply = await myContract.totalSupply()

    console.log(`Total supply of the token: ${totalSupply.toString()}`)
})
