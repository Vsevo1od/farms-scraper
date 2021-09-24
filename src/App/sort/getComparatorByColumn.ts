import { Row } from '../types/Row';

type Comparator = (a: Row, b: Row) => number;

export default function getComparatorByColumn(sortColumn: keyof Row): Comparator {
  switch (sortColumn) {
    case 'app':
    case 'coins':
    case 'network':
      return (a, b) => a[sortColumn].localeCompare(b[sortColumn]);
    case 'totalApyFormatted':
      return (a, b) => a.totalApy - b.totalApy;
    default:
      throw new Error(`unsupported sortColumn: "${sortColumn}"`);
  }
}
