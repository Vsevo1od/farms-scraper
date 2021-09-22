import { Row } from './Row';

export interface Filter extends Omit<Row, 'totalApyFormatted' | 'totalApy' | 'network' | 'app' | 'coins'> {
  enabled: boolean;
}
