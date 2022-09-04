import { utils } from 'ethers';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import CollectionConfig from '../config/CollectionConfig';
import NFTContractProvider from '../lib/NFTContractProvider';

async function main() {
  if (CollectionConfig.whitelistAddresses.length < 1) {
    throw '\x1b[31merror\x1b[0m ' + 'The Whitelist Is Empty, Please Add Some Addresses To The Configuration';
  }

  const leafNodes = CollectionConfig.whitelistAddresses.map(addr => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  const rootHash = '0x' + merkleTree.getRoot().toString('hex');

  const contract = await NFTContractProvider.getContract();

  const whitelistPrice = utils.parseEther(CollectionConfig.whitelistSale.price.toString());
  if (!await (await contract.cost()).eq(whitelistPrice)) {
    console.log(`Updating The Token Price To: ${CollectionConfig.whitelistSale.price} ${CollectionConfig.mainnet.symbol}`);

    await (await contract.setCost(whitelistPrice)).wait();
  }

  if (!await (await contract.maxMintAmountPerTx()).eq(CollectionConfig.whitelistSale.maxMintAmountPerTx)) {
    console.log(`Updating The Max Mint Amount Per TX To: ${CollectionConfig.whitelistSale.maxMintAmountPerTx}`);

    await (await contract.setMaxMintAmountPerTx(CollectionConfig.whitelistSale.maxMintAmountPerTx)).wait();
  }

  if ((await contract.merkleRoot()) !== rootHash) {
    console.log(`Updating The Root Hash To: ${rootHash}`);

    await (await contract.setMerkleRoot(rootHash)).wait();
  }
  
  if (!await contract.whitelistMintEnabled()) {
    console.log('Enabling Whitelist Sale');

    await (await contract.setWhitelistMintEnabled(true)).wait();
  }

  console.log('Whitelist Sale Has Been Enabled');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
