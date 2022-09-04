import CollectionConfigInterface from '../lib/CollectionConfigInterface';
import * as Networks from '../lib/Networks';
import * as Marketplaces from '../lib/Marketplaces';
import whitelistAddresses from './whitelist.json';

const CollectionConfig: CollectionConfigInterface = {
  testnet: Networks.ethereumTestnet,
  mainnet: Networks.ethereumMainnet,
  contractName: 'Bagholderz',
  tokenName: 'bagholderz',
  tokenSymbol: 'BAGZ',
  hiddenMetadataUri: 'ipfs://QmPK8x3Lj7bWHR6pnDvDRE6V7nLDLNoEyu2pE5jBRuDuzF/placeholder.json',
  maxSupply: 1000,
  whitelistSale: {
    price: 0.0,
    maxMintAmountPerTx: 19,
  },
  preSale: {
    price: 0.1,
    maxMintAmountPerTx: 100,
  },
  publicSale: {
    price: 0.1,
    maxMintAmountPerTx: 100,
  },
  contractAddress: "0xB1612A1bCD9A3558cab86EAB59BF98F79E779d5A",
  marketplaceIdentifier: 'bagholderz',
  marketplaceConfig: Marketplaces.openSea,
  whitelistAddresses,
};

export default CollectionConfig;
