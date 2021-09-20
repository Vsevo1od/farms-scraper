import React, { useEffect, useState } from 'react';
import DataGrid, { Column } from 'react-data-grid';
import './App.scss';

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
        .map(([name, body]: [string, EntryBody]) => ({
          name,
          totalApy: `${(body.totalApy * 100).toFixed(2)}%`,
        })),
    );

    setColumns([
      { key: 'name', name: 'Name' },
      { key: 'totalApy', name: 'Total APY' },
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
