import NetworkConfigInterface from './NetworkConfigInterface';

export const hardhatLocal: NetworkConfigInterface = {
  chainId: 31337,
  symbol: 'ETH',
  blockExplorer: {
    name: 'Block Explorer (Not Available On Local Chains)',
    generateContractUrl: (contractAddress: string) => `#`,
    generateTransactionUrl: (transactionAddress: string) => `#`,
  },
}

export const ethereumTestnet: NetworkConfigInterface = {
  chainId: 4,
  symbol: 'ETH',
  blockExplorer: {
    name: 'Etherscan (Rinkeby)',
    generateContractUrl: (contractAddress: string) => `https://rinkeby.etherscan.io/address/${contractAddress}`,
    generateTransactionUrl: (transactionAddress: string) => `https://rinkeby.etherscan.io/tx/${transactionAddress}`,
  },
}

export const ethereumMainnet: NetworkConfigInterface = {
  chainId: 1,
  symbol: 'ETH',
  blockExplorer: {
    name: 'Etherscan',
    generateContractUrl: (contractAddress: string) => `https://etherscan.io/address/${contractAddress}`,
    generateTransactionUrl: (transactionAddress: string) => `https://etherscan.io/tx/${transactionAddress}`,
  },
}