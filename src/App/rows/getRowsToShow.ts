import { useMemo } from 'react';
import { SortColumn } from 'react-data-grid';
import getCompareRowsBySortColumnsFunction from '../sort/getCompareRowsBySortColumnsFunction';
import { Filters } from '../types/Filters';
import { Row } from '../types/Row';

export default (
  rows: readonly Row[], sortColumns: readonly SortColumn[], filters: Filters,
): Row[] => {
  const sortRows = (): readonly Row[] => {
    if (sortColumns.length === 0) {
      return rows;
    }

    return [...rows].sort(getCompareRowsBySortColumnsFunction(sortColumns));
  };

  const sortedRows = useMemo(sortRows, [rows, sortColumns]);

  const areCoinsInRow = (coins: string[], row: Row)
  : boolean => coins.some((coin) => row.coin2?.includes(coin) || row.coin1.includes(coin));

  const areRowOfTypes = (types: string[], row: Row)
  : boolean => types.some((type) => row.types.includes(type));

  const isRowShowed = (row: Row): boolean => (filters.totalApy || 0) <= row.totalApy
  && (filters.networks.length === 0 || filters.networks.includes(row.network))
  && (filters.apps.length === 0 || filters.apps.includes(row.app))
  && (filters.coins.length === 0 || areCoinsInRow(filters.coins, row))
  && (filters.types.length === 0 || areRowOfTypes(filters.types, row));

  const filterRows = () => sortedRows.filter(isRowShowed);
  return useMemo(filterRows, [sortedRows, filters]);
};
