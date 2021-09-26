const btcs = [
  'btc', 'wbtc', 'ibbtc', 'ibtc', 'beltbtc', 'renbtc', 'tbtc', 'pbtc', 'anybtc', 'acs3btc', 'sbtc',
  'hbtc', 'bbtc', 'obtc',
];

const eths = [
  'eth', 'weth', 'beth', 'ieth', 'ibeth', 'belteth', 'aeth', 'seth', 'reth', 'ankreth', 'steth',
];

const bnbs = ['bnb', 'wbnb', 'beltbnb', 'ibbnb', 'ibnb'];

const rest = [
  'aave', 'ada', 'atom', 'bch', 'bsv', 'cake', 'doge', 'dot', 'eos', 'ftm', 'icake', 'isushi',
  'iuni', 'ksm', 'link', 'ltc', 'luna', 'matic', 'one', 'sol', 'sushi', 'tron', 'uni', 'wmatic',
  'xlm', 'xmr', 'xrp',
];

export default [...btcs, ...eths, ...bnbs, ...rest] as const;
