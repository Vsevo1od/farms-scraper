import {
  avalanchePools,
  avalancheStakePools,
  bscPools,
  bscStakePools,
  fantomPools,
  fantomStakePools,
  hecoPools,
  hecoStakePools,
  polygonPools,
  polygonStakePools,
  harmonyPools,
  harmonyStakePools,
} from '../../../beefyPools';
import Network from '../../enums/Network';

const avalancheAll = [avalanchePools, avalancheStakePools].flat();
const bscAll = [bscPools, bscStakePools].flat();
const fantomAll = [fantomPools, fantomStakePools].flat();
const hecoAll = [hecoPools, hecoStakePools].flat();
const polygonAll = [polygonPools, polygonStakePools].flat();
const harmonyAll = [harmonyPools, harmonyStakePools].flat();

const getNetwork = (requestedId: string): Network => {
  if (avalancheAll.map(({ id }) => id).includes(requestedId)) {
    return Network.AVAX;
  }
  if (bscAll.map(({ id }) => id).includes(requestedId)) {
    return Network.BSC;
  }
  if (fantomAll.map(({ id }) => id).includes(requestedId)) {
    return Network.FTM;
  }
  if (hecoAll.map(({ id }) => id).includes(requestedId)) {
    return Network.HECO;
  }
  if (polygonAll.map(({ id }) => id).includes(requestedId)) {
    return Network.MATIC;
  }
  if (harmonyAll.map(({ id }) => id).includes(requestedId)) {
    return Network.ONE;
  }
  return Network.UNKNOWN;
};

export default getNetwork;
