import { GEMS, TRUSTED_STABLES } from '../constants/coinTypes';

function isCoinPairIncludesOnlyCoinsFromList(
  coin1: string,
  coin2: string | undefined,
  coinsList: string[] | readonly string[],
) {
  const isCoin1InList = coinsList.includes(coin1);
  if (!coin2) {
    return isCoin1InList;
  }
  const isCoin2InList = coinsList.includes(coin2);
  return isCoin1InList && isCoin2InList;
}

export default function getCoinsType(coin1: string, coin2?: string): string[] {
  const result = [];
  if (isCoinPairIncludesOnlyCoinsFromList(coin1, coin2, GEMS)) {
    result.push('💎');
  }
  if (isCoinPairIncludesOnlyCoinsFromList(coin1, coin2, TRUSTED_STABLES)) {
    result.push('🛡️💲');
  }

  return result;
}
