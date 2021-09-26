import { GEMS } from '../constants';

function isGems(coin1: string, coin2?: string) {
  const isCoin1Gem = GEMS.includes(coin1);
  if (!coin2) {
    return isCoin1Gem;
  }
  const isCoin2Gem = GEMS.includes(coin2);
  return isCoin1Gem && isCoin2Gem;
}

export default function getCoinsType(coin1: string, coin2?: string): string[] {
  const result = [];
  if (isGems(coin1, coin2)) {
    result.push('💎');
  }
  return result;
}
