import { Row } from './Row';

export interface Filter extends Omit<Row, 'totalApyFormatted' | 'network' | 'app' | 'coins'> {
  enabled: boolean;
}
