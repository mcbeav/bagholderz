import { Bagholderz as ContractType } from '../typechain/index';

import { ethers } from 'hardhat';
import CollectionConfig from './../config/CollectionConfig';

export default class NFTContractProvider {
  public static async getContract(): Promise<ContractType> {
    if (null === CollectionConfig.contractAddress) {
      throw '\x1b[31merror\x1b[0m ' + 'Please Add The Contract Address To The Configuration Before Running This Command';
    }

    if (await ethers.provider.getCode(CollectionConfig.contractAddress) === '0x') {
      throw '\x1b[31merror\x1b[0m ' + `Can't Find A Contract Deployed To The Target Address: ${CollectionConfig.contractAddress}`;
    }
    
    return await ethers.getContractAt(CollectionConfig.contractName, CollectionConfig.contractAddress) as ContractType;
  }
};

export type NFTContractType = ContractType;
