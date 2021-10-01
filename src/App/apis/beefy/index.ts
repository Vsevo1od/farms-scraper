import { EntryBody } from '../../types/EntryBody';
import { RawRow } from '../../types/RawRow';
import { TvlsJson } from '../../types/TvlsJson';
import getTvlAndNetworkLookupTable from './getTvlAndNetworkLookupTable';

export default async (): Promise<RawRow[]> => {
  const response = await fetch('https://api.beefy.finance/apy/breakdown');
  const responseJson: Record<string, EntryBody> = await response.json();

  const tvls = await fetch('https://api.beefy.finance/tvl');
  const tvlsJson: TvlsJson = await tvls.json();
  const tvlLookupTable = getTvlAndNetworkLookupTable(tvlsJson);

  return Object.entries(responseJson)
    .filter(([,body]) => body.totalApy)
    .filter(([idUniqueToAPI]) => tvlLookupTable[idUniqueToAPI])
    .map(([idUniqueToAPI, { totalApy }]: [string, EntryBody]): RawRow => {
      const [app, coin1, coin2] = idUniqueToAPI.split('-');

      return {
        idUniqueToAPI,
        totalApyPercents: totalApy * 100,
        network: tvlLookupTable[idUniqueToAPI].network,
        tvl: tvlLookupTable[idUniqueToAPI].tvl,
        app: `beefy + ${app}`,
        coin1,
        coin2,
      };
    })
    .filter(({ network }) => network);
};
