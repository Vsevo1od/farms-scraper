import { Row } from '../types/Row';
import loadBeefyRows from './beefy';
import rawRowsToRows from './rawRowsToRows';

export default async () : Promise<Row[]> => rawRowsToRows(await loadBeefyRows());
