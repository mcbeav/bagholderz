import { ethers } from 'hardhat';
import CollectionConfig from '../config/CollectionConfig';
import { NFTContractType } from '../lib/NFTContractProvider';
import ContractArguments from '../config/ContractArguments';

async function main() {

  console.log('Deploying Contract');

  const Contract = await ethers.getContractFactory(CollectionConfig.contractName);
  const contract = await Contract.deploy(...ContractArguments) as NFTContractType;

  await contract.deployed();

  console.log('Contract Deployed To:', contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
