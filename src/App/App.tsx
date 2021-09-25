import React, {
  useEffect, useMemo, useState,
} from 'react';
import DataGrid, { SortColumn } from 'react-data-grid';
import generateColumns from './apis/generateColumns';
import loadData from './apis/loadAllData';
import './App.scss';
import { AUTOCOMPLETE_CLASS_NAME, DEFAULT_HEADER_HEIGHT_PX, LINE_HEIGHT_PX } from './constants';
import fixScrollInsideNumberInputScrollsPage from './filter/fixScrollInsideNumberInputScrollsPage';
import { FilterContext } from './FilterRenderer/FilterRenderer';
import getCompareRowsBySortColumnsFunction from './sort/getCompareRowsBySortColumnsFunction';
import { AnyColumn } from './types/Column';
import { Filters } from './types/Filters';
import { Row } from './types/Row';

function App() {
  const [rows, setRows] = useState<readonly Row[]>([]);
  const [columns, setColumns] = useState<readonly AnyColumn[]>([]);
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);
  const [filters, setFilters] = useState<Filters>({
    totalApy: '',
    enabled: true,
    networks: [],
    app: '',
    coins: '',
  });
  const [headerHeightPx, setHeaderHeightPx] = useState<number>(DEFAULT_HEADER_HEIGHT_PX);

  useEffect((): void => {
    loadData().then(setRows);
  }, []);

  fixScrollInsideNumberInputScrollsPage();

  const sortRows = (): readonly Row[] => {
    if (sortColumns.length === 0) {
      return rows;
    }

    return [...rows].sort(getCompareRowsBySortColumnsFunction(sortColumns));
  };

  const sortedRows = useMemo(sortRows, [rows, sortColumns]);

  const isRowShowed = (row: Row): boolean => (filters.totalApy || 0) <= row.totalApy
  && (filters.networks.length === 0 || filters.networks.includes(row.network))
  && row.app.includes(filters.app)
  && row.coins.includes(filters.coins);

  const filterRows = () => sortedRows.filter(isRowShowed);
  const filteredSortedRows = useMemo(filterRows, [sortedRows, filters]);

  const updateColumns = () => {
    const updatedColumns = generateColumns(rows, filteredSortedRows, setFilters);
    setColumns(updatedColumns);
  };
  useEffect(updateColumns, [rows]);

  const updateHeaderHight = () => {
    const autocompleteHeights = [...document.querySelectorAll(`.${AUTOCOMPLETE_CLASS_NAME}`)]
      .map((el) => getComputedStyle(el))
      .map(({ height }) => parseInt(height, 10));
    const maxAutocompleteHeight = Math.max(...autocompleteHeights, LINE_HEIGHT_PX);
    const titleHeight = LINE_HEIGHT_PX;
    const paddingBottom = 10;

    setHeaderHeightPx(titleHeight + maxAutocompleteHeight + paddingBottom);
  };
  useEffect(updateHeaderHight, [filters]);

  return (
    <div className="app">
      <FilterContext.Provider value={filters}>
        <DataGrid
          rows={filteredSortedRows}
          columns={columns}
          style={{
            height: '100%',
            lineHeight: `${LINE_HEIGHT_PX}px`,
          }}
          defaultColumnOptions={{
            sortable: true,
            resizable: true,
          }}
          sortColumns={sortColumns}
          onSortColumnsChange={setSortColumns}
          headerRowHeight={headerHeightPx}
        />
      </FilterContext.Provider>
    </div>
  );
}

export default App;
