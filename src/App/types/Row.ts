export interface Row {
  id: string,
  totalApyFormatted: string,
  totalApy: number,
  network: string,
  app: string,
  // coins should be lower cased for type checks
  coin1: string,
  coin2?: string,
  coinsFormatted: string,
  types: string[],
  tvl?: number,
}
