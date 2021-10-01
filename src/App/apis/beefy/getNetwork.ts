import Network from '../../enums/Network';
import NetworkId from '../../enums/NetworkId';

const networkIdToNetwork: Record<NetworkId, Network> = {
  [NetworkId.BSC]: Network.BSC,
  [NetworkId.HECO]: Network.HECO,
  [NetworkId.MATIC]: Network.MATIC,
  [NetworkId.FTM]: Network.FTM,
  [NetworkId.ARBITRUM]: Network.ARBITRUM,
  [NetworkId.AVAX]: Network.AVAX,
  [NetworkId.ONE]: Network.ONE,
};

export default function getNetwork(networkId: NetworkId) {
  return networkIdToNetwork[networkId];
}
