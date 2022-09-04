import fs from 'fs';
import * as dotenv from 'dotenv';
import { HardhatUserConfig, task } from 'hardhat/config';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import CollectionConfig from './config/CollectionConfig';

dotenv.config();

const DEFAULT_GAS_MULTIPLIER: number = 1;

task('accounts', 'Prints The List Of Accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task('generate-root-hash', 'Generates And Prints Out The Root Hash For The Current Whitelist', async () => {
  if (CollectionConfig.whitelistAddresses.length < 1) {
    throw 'The Whitelist Is Empty, Please Add Some Addresses To The Configuration';
  }

  const leafNodes = CollectionConfig.whitelistAddresses.map(addr => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  const rootHash = '0x' + merkleTree.getRoot().toString('hex');

  console.log('The Merkle Tree Root Hash For The Current Whitelist Is: ' + rootHash);
});

task('generate-proof', 'Generates And Prints Out The Whitelist Proof For The Given Address (Compatible With Block Explorers Such As Etherscan)', async (taskArgs: {address: string}) => {
  if (CollectionConfig.whitelistAddresses.length < 1) {
    throw 'The Whitelist Is Empty, Please Add Some Addresses To The Configuration';
  }

  const leafNodes = CollectionConfig.whitelistAddresses.map(addr => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  const proof = merkleTree.getHexProof(keccak256(taskArgs.address)).toString().replace(/'/g, '').replace(/ /g, '');

  console.log('The Whitelist Proof For The Given Address Is: ' + proof);
})
.addPositionalParam('address', 'The Public Address');

task('rename-contract', 'Renames The Smart Contract Replacing All Occurrences In Source Files', async (taskArgs: {newName: string}, hre) => {
  if (!/^([A-Z][A-Za-z0-9]+)$/.test(taskArgs.newName)) {
    throw 'The Contract Name Must Be In PascalCase: https://en.wikipedia.org/wiki/Camel_case#Variations_and_synonyms';
  }

  const oldContractFile = `${__dirname}/contracts/${CollectionConfig.contractName}.sol`;
  const newContractFile = `${__dirname}/contracts/${taskArgs.newName}.sol`;

  if (!fs.existsSync(oldContractFile)) {
    throw `Contract File Not Found: "${oldContractFile}"`;
  }

  if (fs.existsSync(newContractFile)) {
    throw `A File With That Name Already Exists: "${oldContractFile}"`;
  }

  replaceInFile(__dirname + '/../dapp/src/scripts/lib/NFTContractType.ts', CollectionConfig.contractName, taskArgs.newName);
  replaceInFile(__dirname + '/config/CollectionConfig.ts', CollectionConfig.contractName, taskArgs.newName);
  replaceInFile(__dirname + '/lib/NFTContractProvider.ts', CollectionConfig.contractName, taskArgs.newName);
  replaceInFile(oldContractFile, CollectionConfig.contractName, taskArgs.newName);

  fs.renameSync(oldContractFile, newContractFile);

  console.log(`Contract Renamed Successfully From "${CollectionConfig.contractName}" to "${taskArgs.newName}"!`);

  await hre.run('typechain');
})
.addPositionalParam('newName', 'The new name');


const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    truffle: {
      url: 'http://localhost:24012/rpc',
      timeout: 60000,
      gasMultiplier: DEFAULT_GAS_MULTIPLIER,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
    coinmarketcap: process.env.GAS_REPORTER_COIN_MARKET_CAP_API_KEY,
  },
  etherscan: {
    apiKey: {
      rinkeby: process.env.BLOCK_EXPLORER_API_KEY,
      mainnet: process.env.BLOCK_EXPLORER_API_KEY
    },
  },
};

if (process.env.NETWORK_TESTNET_URL !== undefined) {
  config.networks!.testnet = {
    url: process.env.NETWORK_TESTNET_URL,
    accounts: [process.env.NETWORK_TESTNET_PRIVATE_KEY!],
    gasMultiplier: DEFAULT_GAS_MULTIPLIER,
  };
}

if (process.env.NETWORK_MAINNET_URL !== undefined) {
  config.networks!.mainnet = {
    url: process.env.NETWORK_MAINNET_URL,
    accounts: [process.env.NETWORK_MAINNET_PRIVATE_KEY!],
    gasMultiplier: DEFAULT_GAS_MULTIPLIER,
  };
}

export default config;

function replaceInFile(file: string, search: string, replace: string): void
{
  const fileContent = fs.readFileSync(file, 'utf8').replace(new RegExp(search, 'g'), replace);

  fs.writeFileSync(file, fileContent, 'utf8');
}
