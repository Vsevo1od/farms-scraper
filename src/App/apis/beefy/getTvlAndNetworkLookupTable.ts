import Network from '../../enums/Network';
import NetworkId, { assertIsNetworkId } from '../../enums/NetworkId';
import { TvlsJson } from '../../types/TvlsJson';
import getNetwork from './getNetwork';

type TvlLookupTable = Record<string, {
  networkId: NetworkId;
  network: Network;
  tvl: number;
}>;

export default function getTvlAndNetworkLookupTable(tvls: TvlsJson): TvlLookupTable {
  const result: TvlLookupTable = {};
  Object.entries(tvls).forEach(([networkIdString, pools]) => {
    const networkId = parseInt(networkIdString, 10);
    assertIsNetworkId(networkId);

    Object.entries(pools).forEach(([name, tvl]) => {
      result[name] = { networkId, tvl, network: getNetwork(networkId) };
    });
  });
  return result;
}
