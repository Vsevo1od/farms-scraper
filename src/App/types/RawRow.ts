import Network from '../enums/Network';

export type RawRow = {
  idUniqueToAPI: string,
  totalApyPercents: number,
  network: Network,
  app: string,
  // coins should be lower cased for type checks
  coin1: string,
  coin2?: string,
  restCoins?: string[],
  tvl?: number,
};
