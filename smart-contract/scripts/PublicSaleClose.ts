import NFTContractProvider from '../lib/NFTContractProvider';

async function main() {
  const contract = await NFTContractProvider.getContract();
  
  if (!await contract.paused()) {
    console.log('Pausing The Contract');

    await (await contract.setPaused(true)).wait();
  }

  console.log('Public Sale Is Now Closed');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
