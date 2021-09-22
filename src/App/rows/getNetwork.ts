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
} from '../../beefyPools';

const avalancheAll = [avalanchePools, avalancheStakePools].flat();
const bscAll = [bscPools, bscStakePools].flat();
const fantomAll = [fantomPools, fantomStakePools].flat();
const hecoAll = [hecoPools, hecoStakePools].flat();
const polygonAll = [polygonPools, polygonStakePools].flat();
const harmonyAll = [harmonyPools, harmonyStakePools].flat();

const getNetwork = (requestedId: string): string => {
  if (avalancheAll.map(({ id }) => id).includes(requestedId)) {
    return 'AVAX';
  }
  if (bscAll.map(({ id }) => id).includes(requestedId)) {
    return 'BSC';
  }
  if (fantomAll.map(({ id }) => id).includes(requestedId)) {
    return 'FTM';
  }
  if (hecoAll.map(({ id }) => id).includes(requestedId)) {
    return 'HECO';
  }
  if (polygonAll.map(({ id }) => id).includes(requestedId)) {
    return 'MATIC';
  }
  if (harmonyAll.map(({ id }) => id).includes(requestedId)) {
    return 'ONE';
  }
  return '';
};

export default getNetwork;
