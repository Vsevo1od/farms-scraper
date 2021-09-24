import { Row } from './Row';

export interface Filters extends Omit<Row, 'id' | 'totalApy' | 'totalApyFormatted' > {
  enabled: boolean;
  totalApy: number | '';
}
