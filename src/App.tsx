import React, { useEffect, useMemo, useState } from 'react';
import DataGrid, { Column, SortColumn } from 'react-data-grid';
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

function App() {
  type EntryBody = {
    totalApy: number,
  };

  type Row = {
    id: string,
    totalApyFormatted: string,
    totalApy: number,
    network: string,
    app: string,
    coin1: string,
    coin2: string,
  };

  type AnyColumn = Column<Row>;

  const [rows, setRows] = useState<readonly Row[]>([]);
  const [columns, setColumns] = useState<readonly AnyColumn[]>([]);
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

  const loadBeefyData = async () => {
    const response = await fetch('https://api.beefy.finance/apy/breakdown');
    const responseJson: Record<string, EntryBody> = await response.json();

    setRows(
      Object.entries(responseJson)
        .filter(([,body]) => body.totalApy)
        .map(([id, body]: [string, EntryBody]) => ({
          id,
          totalApy: body.totalApy,
          totalApyFormatted: `${(body.totalApy * 100).toFixed(2)}%`,
          network: getNetwork(id),
          app: id.split('-')[0],
          coin1: id.split('-')[1],
          coin2: id.split('-')[2],
        })),
    );

    setColumns([
      { key: 'id', name: 'ID' },
      { key: 'totalApyFormatted', name: 'Total APY' },
      { key: 'network', name: 'Network' },
      { key: 'app', name: 'App' },
      { key: 'coin1', name: 'Coin 1' },
      { key: 'coin2', name: 'Coin 2' },
    ]);
  };

  useEffect((): void => {
    loadBeefyData();
  }, []);

  type Comparator = (a: Row, b: Row) => number;

  function getComparatorByColumn(sortColumn: keyof Row): Comparator {
    switch (sortColumn) {
      case 'app':
      case 'coin1':
      case 'coin2':
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

  return (
    <div className="App">
      <DataGrid
        rows={sortedRows}
        columns={columns}
        style={{ height: '100%' }}
        defaultColumnOptions={{
          sortable: true,
          resizable: true,
        }}
        sortColumns={sortColumns}
        onSortColumnsChange={setSortColumns}
      />
    </div>
  );
}

export default App;
