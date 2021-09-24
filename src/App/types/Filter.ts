import { Row } from './Row';

export interface Filter extends Omit<Row, 'totalApy' | 'totalApyFormatted' > {
  enabled: boolean;
  totalApy: number | '';
}
