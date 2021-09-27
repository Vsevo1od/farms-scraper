export type RawRow = {
  idUniqueToAPI: string,
  totalApyPercents: number,
  network: string,
  app: string,
  // coins should be lower cased for type checks
  coin1: string,
  coin2?: string,
  restCoins?: string[],
};
