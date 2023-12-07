import { deployments, getNamedAccounts } from "hardhat"
import { verify } from "./helpers/verify"

async function main() {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const WAIT_BLOCK_CONFIRMATIONS = 6

    const fundManager = await deploy("ERC20Token", {
        from: deployer,
        log: true,
        waitConfirmations: WAIT_BLOCK_CONFIRMATIONS,
    })
    console.log("FundManager deployed to:", fundManager.address)
    await verify(fundManager.address, [])
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
