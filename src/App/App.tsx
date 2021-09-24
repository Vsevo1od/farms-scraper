import React, {
  useEffect, useMemo, useState,
} from 'react';
import DataGrid, { SortColumn } from 'react-data-grid';
import loadBeefyData, { ALL_NETWORKS } from './apis/loadBeefyData';
import './App.scss';
import fixScrollInsideNumberInputScrollsPage from './filter/fixScrollInsideNumberInputScrollsPage';
import { FilterContext } from './FilterRenderer/FilterRenderer';
import getCompareRowsBySortColumnsFunction from './sort/getCompareRowsBySortColumnsFunction';
import { AnyColumn } from './types/Column';
import { Filter } from './types/Filter';
import { Row } from './types/Row';

function App() {
  const [rows, setRows] = useState<readonly Row[]>([]);
  const [columns, setColumns] = useState<readonly AnyColumn[]>([]);
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);
  const [filters, setFilters] = useState<Filter>({
    id: '',
    totalApy: '',
    enabled: true,
    network: ALL_NETWORKS,
    app: '',
    coins: '',
  });

  useEffect((): void => {
    loadBeefyData(setRows, setColumns, setFilters);
  }, []);

  fixScrollInsideNumberInputScrollsPage();

  const sortRows = (): readonly Row[] => {
    if (sortColumns.length === 0) {
      return rows;
    }

    return [...rows].sort(getCompareRowsBySortColumnsFunction(sortColumns));
  };

  const sortedRows = useMemo(sortRows, [rows, sortColumns]);

  const isRowShowed = (row: Row): boolean => row.id.includes(filters.id)
  && ((row.totalApy * 100) >= (filters.totalApy || 0))
  && (filters.network === ALL_NETWORKS ? true : row.network.includes(filters.network))
  && row.app.includes(filters.app)
  && row.coins.includes(filters.coins);

  const filterRows = () => sortedRows.filter(isRowShowed);
  const filteredSortedRows = useMemo(filterRows, [sortedRows, filters]);

  return (
    <div className="app">
      <FilterContext.Provider value={filters}>
        <DataGrid
          rows={filteredSortedRows}
          columns={columns}
          style={{
            height: '100%',
            lineHeight: '35px',
          }}
          defaultColumnOptions={{
            sortable: true,
            resizable: true,
          }}
          sortColumns={sortColumns}
          onSortColumnsChange={setSortColumns}
          headerRowHeight={filters.enabled ? 70 : undefined}
        />
      </FilterContext.Provider>
    </div>
  );
}

export default App;
