import { Row } from '../types/Row';

type Comparator = (a: Row, b: Row) => number;

export default function getComparatorByColumn(sortColumn: keyof Row): Comparator {
  switch (sortColumn) {
    case 'app':
    case 'coinsFormatted':
    case 'network':
      return (a, b) => a[sortColumn].localeCompare(b[sortColumn]);
    case 'totalApy':
      return (a, b) => a.totalApy - b.totalApy;
    case 'tvl':
      return (a, b) => (a.tvl || 0) - (b.tvl || 0);
    case 'types':
      return (a, b) => a.types.join('').localeCompare(b.types.join(''));
    default:
      throw new Error(`unsupported sortColumn: "${sortColumn}"`);
  }
}
