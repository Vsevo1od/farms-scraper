import formatCoinsAsString from '../rows/formatCoinsAsString';
import { RawRow } from '../types/RawRow';
import { Row } from '../types/Row';
import getNetwork from './beefy/getNetwork';

export default (rawRows: RawRow[]): Row[] => rawRows.map((rawRow)
: Row => ({
  id: `beefy_${rawRow.idUniqueToAPI}`,
  totalApy: rawRow.totalApyPercents,
  totalApyFormatted: `${(rawRow.totalApyPercents).toFixed(2)}%`,
  network: getNetwork(rawRow.idUniqueToAPI),
  app: rawRow.app,
  coins: formatCoinsAsString(rawRow.coin1, rawRow.coin2),
}));
