import { Row } from './Row';

export interface Filter extends Omit<Row, 'id' | 'totalApy' | 'totalApyFormatted' > {
  enabled: boolean;
  totalApy: number | '';
}
