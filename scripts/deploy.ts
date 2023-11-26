import { deployments, getNamedAccounts } from "hardhat"
import { verify } from "./helpers/verify"

async function main() {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const WAIT_BLOCK_CONFIRMATIONS = 12
    const args = [11]

    const fundManager = await deploy("FundManager", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: WAIT_BLOCK_CONFIRMATIONS,
    })
    console.log("FundManager deployed to:", fundManager.address)
    await verify(fundManager.address, args)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
