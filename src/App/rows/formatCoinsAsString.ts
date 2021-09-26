function formatCoinsAsString(coin1: string, coin2?: string): string {
  if (!coin2) {
    return coin1.toUpperCase();
  }

  const isCoin1NameLessThanCoin2Name = coin1.localeCompare(coin2) <= 0;
  const lowerCaseResult = isCoin1NameLessThanCoin2Name ? `${coin1} / ${coin2}` : `${coin2} / ${coin1}`;
  return lowerCaseResult.toUpperCase();
}

export default formatCoinsAsString;
