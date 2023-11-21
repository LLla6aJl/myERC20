import {ethers, run, network} from 'hardhat'
import { verify } from './helpers/verify';

async function main() {
	const [deployer] = await ethers.getSigners();
	console.log("Deploying contracts with the account:", deployer.address);
  
	const FundManager = await ethers.getContractFactory("FundManager");
	const fundManager = await FundManager.deploy();
	const WAIT_BLOCK_CONFIRMATIONS = 12;
	await fundManager.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
	console.log("FundManager deployed to:", fundManager.address);
	await verify(fundManager.address, [])
  }
  
  main().then(() => process.exit(0)).catch(error => {
	console.error(error);
	process.exit(1);
  });