import React, {
  createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import DataGrid, { Column, HeaderRendererProps, SortColumn } from 'react-data-grid';
import './App.scss';
import {
  avalanchePools,
  avalancheStakePools,
  bscPools,
  bscStakePools,
  fantomPools,
  fantomStakePools,
  hecoPools,
  hecoStakePools,
  polygonPools,
  polygonStakePools,
  harmonyPools,
  harmonyStakePools,
} from './beefyPools';

const avalancheAll = [avalanchePools, avalancheStakePools].flat();
const bscAll = [bscPools, bscStakePools].flat();
const fantomAll = [fantomPools, fantomStakePools].flat();
const hecoAll = [hecoPools, hecoStakePools].flat();
const polygonAll = [polygonPools, polygonStakePools].flat();
const harmonyAll = [harmonyPools, harmonyStakePools].flat();

const getNetwork = (requestedId: string): string => {
  if (avalancheAll.map(({ id }) => id).includes(requestedId)) {
    return 'AVAX';
  }
  if (bscAll.map(({ id }) => id).includes(requestedId)) {
    return 'BSC';
  }
  if (fantomAll.map(({ id }) => id).includes(requestedId)) {
    return 'FTM';
  }
  if (hecoAll.map(({ id }) => id).includes(requestedId)) {
    return 'HECO';
  }
  if (polygonAll.map(({ id }) => id).includes(requestedId)) {
    return 'MATIC';
  }
  if (harmonyAll.map(({ id }) => id).includes(requestedId)) {
    return 'ONE';
  }
  // TODO error or filter
  return '';
};

function formatCoinsAsString(coin1: string, coin2: string) {
  if (!coin2) {
    return coin1;
  }

  const isCoin1NameLessThanCoin2Name = coin1.localeCompare(coin2) >= 0;
  return isCoin1NameLessThanCoin2Name ? `${coin1}/${coin2}` : `${coin2}/${coin1}`;
}

type EntryBody = {
  totalApy: number,
};

type Row = {
  id: string,
  totalApyFormatted: string,
  totalApy: number,
  network: string,
  app: string,
  coins: string,
};

type AnyColumn = Column<Row>;

interface Filter extends Omit<Row, 'totalApyFormatted' | 'totalApy' | 'network' | 'app' | 'coins'> {
  enabled: boolean;
}

// Context is needed to read filter values otherwise columns are
// re-created when filters are changed and filter loses focus
const FilterContext = createContext<Filter | undefined>(undefined);

function useFocusRef<T extends HTMLOrSVGElement>(isSelected: boolean) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    if (!isSelected) return;
    ref.current?.focus({ preventScroll: true });
  }, [isSelected]);

  return {
    ref,
    tabIndex: isSelected ? 0 : -1,
  };
}

function inputStopPropagation(event: React.KeyboardEvent<HTMLInputElement>) {
  if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.stopPropagation();
  }
}

function FilterRenderer<R, SR, T extends HTMLOrSVGElement>({
  isCellSelected,
  column,
  children,
}: HeaderRendererProps<R, SR> & {
  children: (args: {
    ref: React.RefObject<T>;
    tabIndex: number;
    filters: Filter;
  }) => React.ReactElement;
}) {
  const filters = useContext(FilterContext)!;
  const { ref, tabIndex } = useFocusRef<T>(isCellSelected);

  return (
    <>
      <div>{column.name}</div>
      {filters.enabled && <div>{children({ ref, tabIndex, filters })}</div>}
    </>
  );
}

const FILTER_COLUMN_CLASS_NAME = 'filter-cell';

function App() {
  const [rows, setRows] = useState<readonly Row[]>([]);
  const [columns, setColumns] = useState<readonly AnyColumn[]>([]);
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);
  const [filters, setFilters] = useState<Filter>({
    id: '',
    enabled: true,
  });

  const loadBeefyData = async () => {
    const response = await fetch('https://api.beefy.finance/apy/breakdown');
    const responseJson: Record<string, EntryBody> = await response.json();

    setRows(
      Object.entries(responseJson)
        .filter(([,body]) => body.totalApy)
        .map(([id, { totalApy }]: [string, EntryBody]) => {
          const [app, coin1, coin2] = id.split('-');

          return {
            id,
            totalApy,
            totalApyFormatted: `${(totalApy * 100).toFixed(2)}%`,
            network: getNetwork(id),
            app,
            coins: formatCoinsAsString(coin1, coin2),
          };
        })
        .filter(({ network }) => network),
    );

    setColumns([
      {
        key: 'id',
        name: 'ID',
        headerCellClass: FILTER_COLUMN_CLASS_NAME,
        headerRenderer: (p) => (
          // TODO
          // eslint-disable-next-line react/jsx-props-no-spreading
          <FilterRenderer<Row, unknown, HTMLInputElement> {...p}>
            {({ filters: theFilters, ...rest }) => (
              <input
                // TODO
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...rest}
                value={theFilters.id}
                onChange={(e) => setFilters({
                  ...theFilters,
                  id: e.target.value,
                })}
                onKeyDown={inputStopPropagation}
              />
            )}
          </FilterRenderer>
        ),
      },
      { key: 'totalApyFormatted', name: 'Total APY' },
      { key: 'network', name: 'Network' },
      { key: 'app', name: 'App' },
      { key: 'coins', name: 'Coins' },
    ]);
  };

  useEffect((): void => {
    loadBeefyData();
  }, []);

  type Comparator = (a: Row, b: Row) => number;

  function getComparatorByColumn(sortColumn: keyof Row): Comparator {
    switch (sortColumn) {
      case 'app':
      case 'coins':
      case 'id':
      case 'network':
        return (a, b) => a[sortColumn].localeCompare(b[sortColumn]);
      case 'totalApyFormatted':
        return (a, b) => a.totalApy - b.totalApy;
      default:
        throw new Error(`unsupported sortColumn: "${sortColumn}"`);
    }
  }

  const sortRows = (): readonly Row[] => {
    if (sortColumns.length === 0) {
      return rows;
    }

    const compareRowsBySortColumns = (a: Row, b: Row): number => {
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

    return [...rows].sort(compareRowsBySortColumns);
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
