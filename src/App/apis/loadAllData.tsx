import { Row } from '../types/Row';
import loadBeefyRows from './beefy';
import loadFarmArmyRows from './farm.army';
import rawRowsToRows from './rawRowsToRows';

export default async () : Promise<Row[]> => rawRowsToRows([
  ...await loadBeefyRows(),
  ...await loadFarmArmyRows(),
]);
