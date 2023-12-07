import { deployments, getNamedAccounts } from "hardhat"
import { verify } from "./helpers/verify"
import { ethers } from "hardhat"

const DECIMALS = 18
const NAME = "MyToken"
const SYMBOL = "MTK"
const INITIAL_AMOUNT = ethers.utils.parseEther("10")

async function main() {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const WAIT_BLOCK_CONFIRMATIONS = 6

    const fundManager = await deploy("ERC20Token", {
        from: deployer,
        log: true,
        waitConfirmations: WAIT_BLOCK_CONFIRMATIONS,
        args: [NAME, SYMBOL, DECIMALS, INITIAL_AMOUNT],
    })
    console.log("FundManager deployed to:", fundManager.address)
    await verify(fundManager.address, [NAME, SYMBOL, DECIMALS, INITIAL_AMOUNT])
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
