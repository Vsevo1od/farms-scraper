import { Row } from './Row';

export interface Filter extends Omit<Row, 'totalApy' | 'totalApyFormatted' | 'network' | 'app' | 'coins'> {
  enabled: boolean;
  totalApy: number | '';
}
