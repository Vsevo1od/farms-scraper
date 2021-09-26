import { GEMS, TRUSTED_STABLES } from '../constants/coinTypes';

function isCoinPairIncludesOnlyCoinsFromList(
  coin1: string,
  coin2: string | undefined,
  coinsList: string[] | readonly string[],
): boolean {
  const isCoin1InList = coinsList.includes(coin1);
  if (!coin2) {
    return isCoin1InList;
  }
  const isCoin2InList = coinsList.includes(coin2);
  return isCoin1InList && isCoin2InList;
}

function isCoinPairACombinationOfLists(
  coin1: string,
  coin2: string | undefined,
  coinList1: readonly string[] | string[],
  coinList2: readonly string[] | string[],
): boolean {
  if (!coin2) {
    return false;
  }

  const isCoin1InList1 = coinList1.includes(coin1);
  const isCoin1InList2 = coinList2.includes(coin1);

  const isCoin2InList1 = coinList1.includes(coin2);
  const isCoin2InList2 = coinList2.includes(coin2);

  return (isCoin1InList1 && isCoin2InList2) || (isCoin1InList2 && isCoin2InList1);
}

export default function getCoinsType(coin1: string, coin2?: string): string[] {
  const result = [];
  if (isCoinPairIncludesOnlyCoinsFromList(coin1, coin2, GEMS)) {
    result.push('💎');
  }
  if (isCoinPairIncludesOnlyCoinsFromList(coin1, coin2, TRUSTED_STABLES)) {
    result.push('🛡️💲');
  }
  if (isCoinPairACombinationOfLists(coin1, coin2, GEMS, TRUSTED_STABLES)) {
    result.push('💎+🛡️💲');
  }

  return result;
}
