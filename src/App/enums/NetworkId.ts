enum NetworkId {
  BSC = 56,
  HECO = 128,
  MATIC = 137,
  FTM = 250,
  ARBITRUM = 42161,
  AVAX = 43114,
  ONE = 1666600000,
}

export default NetworkId;

export function assertIsNetworkId(networkId: number): asserts networkId is NetworkId {
  if (!(networkId in NetworkId)) {
    throw new Error(`Unknown network id ${networkId}`);
  }
}
