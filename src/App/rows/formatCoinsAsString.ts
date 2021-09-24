function formatCoinsAsString(coin1: string, coin2: string) {
  if (!coin2) {
    return coin1;
  }

  const isCoin1NameLessThanCoin2Name = coin1.localeCompare(coin2) <= 0;
  return isCoin1NameLessThanCoin2Name ? `${coin1}/${coin2}` : `${coin2}/${coin1}`;
}

export default formatCoinsAsString;
