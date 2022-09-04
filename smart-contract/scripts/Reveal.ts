import NFTContractProvider from '../lib/NFTContractProvider';

async function main() {
  if (undefined === process.env.COLLECTION_URI_PREFIX || process.env.COLLECTION_URI_PREFIX === 'ipfs://__CID___/') {
    throw '\x1b[31merror\x1b[0m ' + 'Please Add The URI Prefix To The ENV Configuration Before Running This Command';
  }

  const contract = await NFTContractProvider.getContract();

  if ((await contract.uriPrefix()) !== process.env.COLLECTION_URI_PREFIX) {
    console.log(`Updating The URI Prefix To: ${process.env.COLLECTION_URI_PREFIX}`);

    await (await contract.setUriPrefix(process.env.COLLECTION_URI_PREFIX)).wait();
  }
  
  if (!await contract.revealed()) {
    console.log('Revealing The Collection');

    await (await contract.setRevealed(true)).wait();
  }

  console.log('Your Collection Is Now Revealed');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
