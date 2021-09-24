import { EntryBody } from '../../types/EntryBody';
import { RawRow } from '../../types/RawRow';
import getNetwork from './getNetwork';

export default async (): Promise<RawRow[]> => {
  const response = await fetch('https://api.beefy.finance/apy/breakdown');
  const responseJson: Record<string, EntryBody> = await response.json();
  return Object.entries(responseJson)
    .filter(([,body]) => body.totalApy)
    .map(([idUniqueToAPI, { totalApy }]: [string, EntryBody]): RawRow => {
      const [app, coin1, coin2] = idUniqueToAPI.split('-');

      return {
        idUniqueToAPI,
        totalApyPercents: totalApy * 100,
        network: getNetwork(idUniqueToAPI),
        app,
        coin1,
        coin2,
      };
    })
    .filter(({ network }) => network);
};
