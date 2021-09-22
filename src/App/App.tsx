import React, { useEffect, useMemo, useState } from 'react';
import DataGrid, { SortColumn } from 'react-data-grid';
import loadBeefyData from './apis/loadBeefyData';
import './App.scss';
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
    enabled: true,
  });

  useEffect((): void => {
    loadBeefyData(setRows, setColumns, setFilters);
  }, []);

  const sortRows = (): readonly Row[] => {
    if (sortColumns.length === 0) {
      return rows;
    }

    return [...rows].sort(getCompareRowsBySortColumnsFunction(sortColumns));
  };

  const sortedRows = useMemo(sortRows, [rows, sortColumns]);

  const isRowShowed = (row: Row): boolean => (filters.id ? row.id.includes(filters.id) : true);
  const filterRows = () => sortedRows.filter(isRowShowed);
  const filteredSortedRows = useMemo(filterRows, [sortedRows, filters]);

  // TODO use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function selectStopPropagation(event: React.KeyboardEvent<HTMLSelectElement>) {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.stopPropagation();
    }
  }

  return (
    <div className="App">
      <FilterContext.Provider value={filters}>
        <DataGrid
          rows={filteredSortedRows}
          columns={columns}
          style={{ height: '100%', lineHeight: '35px' }}
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
