import { Row } from './Row';

export interface Filters extends Omit<Row, 'id' | 'totalApy' | 'totalApyFormatted' | 'network'> {
  enabled: boolean;
  totalApy: number | '';
  networks: string[];
}
