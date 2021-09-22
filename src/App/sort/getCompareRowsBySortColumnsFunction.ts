import { SortColumn } from 'react-data-grid';
import { Row } from '../types/Row';
import getComparatorByColumn from './getComparatorByColumn';

export default function getCompareRowsBySortColumnsFunction(sortColumns: readonly SortColumn[]) {
  return (a: Row, b: Row): number => {
    // eslint-disable-next-line no-restricted-syntax
    for (const { columnKey, direction } of sortColumns) {
      const comparator = getComparatorByColumn(columnKey as keyof Row);
      const compareResult = comparator(a, b);

      if (compareResult !== 0) {
        return direction === 'ASC' ? compareResult : -compareResult;
      }
    }
    return 0;
  };
}
