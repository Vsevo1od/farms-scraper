import React, { useEffect, useState } from 'react';
import DataGrid, { Column } from 'react-data-grid';
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
  type AnyRow = Record<string, string | number>;
  type AnyColumn = Column<AnyRow>;

  const [rows, setRows] = useState<AnyRow[]>([]);
  const [columns, setColumns] = useState<AnyColumn[]>([]);

  const loadBeefyData = async () => {
    const response = await fetch('https://api.beefy.finance/apy/breakdown');
    const responseJson: Record<string, EntryBody> = await response.json();

    setRows(
      Object.entries(responseJson)
        .filter(([,body]) => body.totalApy)
        .map(([id, body]: [string, EntryBody]) => ({
          id,
          totalApy: `${(body.totalApy * 100).toFixed(2)}%`,
          network: getNetwork(id),
        })),
    );

    setColumns([
      { key: 'id', name: 'ID' },
      { key: 'totalApy', name: 'Total APY' },
      { key: 'network', name: 'Network' },
    ]);
  };

  useEffect((): void => {
    loadBeefyData();
  }, []);

  return (
    <div className="App">
      <DataGrid rows={rows} columns={columns} style={{ height: '100%' }} />
    </div>
  );
}

export default App;
