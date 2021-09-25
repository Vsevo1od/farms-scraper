import { ThemeProvider } from '@mui/material';
import React, {
  useEffect, useMemo, useState,
} from 'react';
import DataGrid, { SortColumn } from 'react-data-grid';
import generateColumns from './apis/generateColumns';
import loadData from './apis/loadAllData';
import './App.scss';
import { AUTOCOMPLETE_CLASS_NAME, DEFAULT_HEADER_HEIGHT_PX, LINE_HEIGHT_PX } from './constants';
import MaxApyContext from './contexts/MaxApyContext';
import fixScrollInsideNumberInputScrollsPage from './filter/fixScrollInsideNumberInputScrollsPage';
import { FilterContext } from './FilterRenderer/FilterRenderer';
import getCompareRowsBySortColumnsFunction from './sort/getCompareRowsBySortColumnsFunction';
import theme from './theme';
import { Column } from './types/Column';
import { Filters } from './types/Filters';
import { Row } from './types/Row';

function App() {
  const [rows, setRows] = useState<readonly Row[]>([]);
  const [columns, setColumns] = useState<readonly Column[]>([]);
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([
    { columnKey: 'totalApyFormatted', direction: 'DESC' },
  ]);
  const [filters, setFilters] = useState<Filters>({
    totalApy: '',
    enabled: true,
    networks: [],
    apps: [],
    coins: [],
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
  && (filters.apps.length === 0 || filters.apps.includes(row.app))
  && (filters.coins.length === 0 || filters.coins.some((coin) => row.coins.includes(coin)));

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

  const maxApy = useMemo(
    () => Math.max(...filteredSortedRows.map(({ totalApy }) => totalApy)),
    [filteredSortedRows],
  );

  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <FilterContext.Provider value={filters}>
          <MaxApyContext.Provider value={maxApy}>
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
          </MaxApyContext.Provider>
        </FilterContext.Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
