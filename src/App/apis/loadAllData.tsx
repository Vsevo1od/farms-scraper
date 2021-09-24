import { Row } from '../types/Row';
import loadBeefyRows from './beefy';
import rawRowsToRows from './rawRowsToRows';

export const ALL_NETWORKS = 'All';

export default async () : Promise<Row[]> => rawRowsToRows(await loadBeefyRows());
