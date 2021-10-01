import Network from '../../enums/Network';
import { RawRow } from '../../types/RawRow';

type Yield = {
  apy: number,
  daily: number,
};

type Pool = {
  id: string,
  name: string,
  token: string,
  platform: string,
  provider: {
    id: string,
    label: string,
    url: string,
    icon: string,
    token: string,
  },
  earns: string[],
  link: string,
  has_details: boolean,
  extra: {
    transactionToken: string,
    transactionAddress: string,
  }
  chain: string,
  tvl?: {
    amount?: number,
    usd: number,
  }
  yield?: Yield,
  icon: string,
};

type PoolWithYield = Pool & { yield: Yield };

const hasYield = (pool: Pool): pool is PoolWithYield => Number.isFinite(pool.yield?.apy);
const isBeefy = (pool: Pool): boolean => pool.platform === 'Other' && pool.id.startsWith('beefy_');
const isNotBeefy = (pool: Pool): boolean => !isBeefy(pool);

const isKnownNetwork = (network: string)
: network is Network => Object.values(Network).includes(network as Network);
function assertIsKnownNetwork(network: string): asserts network is Network {
  if (!isKnownNetwork(network)) {
    throw new Error(`Unknown network ${network}`);
  }
}

function getCoinPair(pool: PoolWithYield): [string, string | undefined] {
  const tokensName = pool.token || pool.name.replace(/ B?LP/, '');
  const coins = tokensName.split('-');

  let coin1 = coins[0];
  let coin2: string | undefined = coins[1];

  if (coins.length > 2) {
    // Multiple coins, e.g. USDT-USDC-BUSD-DAI BLP, show as one coin
    coin1 = tokensName;
    coin2 = undefined;
  }
  return [coin1, coin2];
}

export default async (): Promise<RawRow[]> => {
  const farmArmyUrl = process.env.REACT_APP_FARM_ARMY_PROXY_URL;
  const response = await fetch(`${farmArmyUrl}/api/v0/farms`);
  const allPools: Pool[] = await response.json();

  const poolsWithYield: PoolWithYield[] = allPools.filter(hasYield);

  return poolsWithYield
    .filter(isNotBeefy)
    .map((pool: PoolWithYield): RawRow => {
      const [coin1, coin2] = getCoinPair(pool);

      const app = pool.platform || pool.id.split('_')[0];
      const network = pool.chain.toUpperCase();
      assertIsKnownNetwork(network);

      return {
        idUniqueToAPI: pool.id,
        totalApyPercents: pool.yield.apy,
        network,
        app,
        coin1,
        coin2,
        tvl: pool?.tvl?.usd,
      };
    });
};
