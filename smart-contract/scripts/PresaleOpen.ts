import { utils } from 'ethers';
import CollectionConfig from '../config/CollectionConfig';
import NFTContractProvider from '../lib/NFTContractProvider';

async function main() {
  const contract = await NFTContractProvider.getContract();

  if (await contract.whitelistMintEnabled()) {
    throw '\x1b[31merror\x1b[0m ' + 'Please Close The Whitelist Sale Before Ppening A Pre-Sale';
  }

  const preSalePrice = utils.parseEther(CollectionConfig.preSale.price.toString());
  if (!await (await contract.cost()).eq(preSalePrice)) {
    console.log(`Updating The Token Price To: ${CollectionConfig.preSale.price} ${CollectionConfig.mainnet.symbol}`);

    await (await contract.setCost(preSalePrice)).wait();
  }

  if (!await (await contract.maxMintAmountPerTx()).eq(CollectionConfig.preSale.maxMintAmountPerTx)) {
    console.log(`Updating The Max Mint Amount Per TX To: ${CollectionConfig.preSale.maxMintAmountPerTx}`);

    await (await contract.setMaxMintAmountPerTx(CollectionConfig.preSale.maxMintAmountPerTx)).wait();
  }
  
  if (await contract.paused()) {
    console.log('Unpausing The Contract');

    await (await contract.setPaused(false)).wait();
  }

  console.log('Pre-Sale Is Now Open');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
