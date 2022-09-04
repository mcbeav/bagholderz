import { utils } from 'ethers';
import CollectionConfig from '../config/CollectionConfig';
import NFTContractProvider from '../lib/NFTContractProvider';

async function main() {
  const contract = await NFTContractProvider.getContract();

  if (await contract.whitelistMintEnabled()) {
    throw '\x1b[31merror\x1b[0m ' + 'Please Close The Whitelist Sale Before Opening A Public Sale';
  }

  const publicSalePrice = utils.parseEther(CollectionConfig.publicSale.price.toString());
  if (!await (await contract.cost()).eq(publicSalePrice)) {
    console.log(`Updating The Token Price To: ${CollectionConfig.publicSale.price} ${CollectionConfig.mainnet.symbol}`);

    await (await contract.setCost(publicSalePrice)).wait();
  }

  if (!await (await contract.maxMintAmountPerTx()).eq(CollectionConfig.publicSale.maxMintAmountPerTx)) {
    console.log(`Updating The Max Mint Amount Per TX To: ${CollectionConfig.publicSale.maxMintAmountPerTx}`);

    await (await contract.setMaxMintAmountPerTx(CollectionConfig.publicSale.maxMintAmountPerTx)).wait();
  }
  
  if (await contract.paused()) {
    console.log('Unpausing The Contract');

    await (await contract.setPaused(false)).wait();
  }

  console.log('Public Sale Is Now Open');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
