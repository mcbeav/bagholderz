import NFTContractProvider from '../lib/NFTContractProvider';

async function main() {
  const contract = await NFTContractProvider.getContract();
  
  if (await contract.whitelistMintEnabled()) {
    console.log('Disabling Whitelist Sale');

    await (await contract.setWhitelistMintEnabled(false)).wait();
  }

  console.log('Whitelist Sale Has Been Disabled');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
