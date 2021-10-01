import { ThemeProvider } from '@mui/material';
import React, {
  useEffect, useMemo, useState,
} from 'react';
import DataGrid, { SortColumn } from 'react-data-grid';
import generateColumns from './apis/generateColumns';
import loadData from './apis/loadAllData';
import './App.scss';
import { DEFAULT_HEADER_HEIGHT_PX, LINE_HEIGHT_PX } from './constants';
import MaxApyContext from './contexts/MaxApyContext';
import fixScrollInsideNumberInputScrollsPage from './filter/fixScrollInsideNumberInputScrollsPage';
import { FilterContext } from './FilterRenderer/FilterRenderer';
import calculateRequiredHeaderHeight from './header/calculateRequiredHeaderHeight';
import getRowsToShow from './rows/getRowsToShow';
import theme from './theme';
import { Column } from './types/Column';
import { Filters } from './types/Filters';
import { Row } from './types/Row';

const defaultFilters: Filters = {
  totalApy: '',
  enabled: true,
  networks: [],
  apps: [],
  coins: [],
  types: [],
  tvl: '',
};

function App() {
  const [rows, setRows] = useState<readonly Row[]>([]);
  const [columns, setColumns] = useState<readonly Column[]>([]);
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([
    { columnKey: 'totalApy', direction: 'DESC' },
  ]);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [headerHeightPx, setHeaderHeightPx] = useState<number>(DEFAULT_HEADER_HEIGHT_PX);

  useEffect((): void => {
    loadData().then(setRows);
  }, []);

  fixScrollInsideNumberInputScrollsPage();

  const rowsToShow = getRowsToShow(rows, sortColumns, filters);

  const updateColumns = () => {
    const updatedColumns = generateColumns(rows, setFilters);
    setColumns(updatedColumns);
  };
  useEffect(updateColumns, [rows]);

  useEffect(() => setHeaderHeightPx(calculateRequiredHeaderHeight()), [filters]);

  const maxApy = useMemo(
    () => Math.max(...rowsToShow.map(({ totalApy }) => totalApy)),
    [rowsToShow],
  );

  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <FilterContext.Provider value={filters}>
          <MaxApyContext.Provider value={maxApy}>
            <DataGrid
              rows={rowsToShow}
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
