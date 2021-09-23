import React from 'react';
import FilterRenderer from '../FilterRenderer/FilterRenderer';
import formatCoinsAsString from '../rows/formatCoinsAsString';
import getNetwork from '../rows/getNetwork';
import { EntryBody } from '../types/EntryBody';
import { Row } from '../types/Row';
import { AnyColumn } from '../types/Column';
import { Filter } from '../types/Filter';

// TODO inline css or use constants
const FILTER_COLUMN_CLASS_NAME = 'filter-cell';

function inputStopPropagation(event: React.KeyboardEvent<HTMLInputElement>) {
  if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.stopPropagation();
  }
}

function inputNumberStopPropagation(event: React.KeyboardEvent<HTMLInputElement>) {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
    event.stopPropagation();
  }
}

export default async (
  setRows: (rows: Row[]) => void,
  setColumns: (columns: AnyColumn[]) => void,
  setFilters: (filters: Filter) => void,
) => {
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
      headerRenderer: (props) => (
        // TODO
        // eslint-disable-next-line react/jsx-props-no-spreading
        <FilterRenderer<Row, unknown, HTMLInputElement> {...props}>
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
    {
      key: 'totalApyFormatted',
      name: 'Total APY',
      headerCellClass: FILTER_COLUMN_CLASS_NAME,
      headerRenderer: (props) => (
        // TODO
        // eslint-disable-next-line react/jsx-props-no-spreading
        <FilterRenderer<Row, unknown, HTMLInputElement> {...props}>
          {({ filters: theFilters, ...rest }) => (
            <input
            // TODO
            // eslint-disable-next-line react/jsx-props-no-spreading
              {...rest}
              value={theFilters.totalApy}
              type="number"
              min="0"
              onChange={(e) => setFilters({
                ...theFilters,
                totalApy: Number.isFinite(e.target.valueAsNumber)
                  ? e.target.valueAsNumber
                  : 0,
              })}
              onKeyDown={inputNumberStopPropagation}
            />
          )}
        </FilterRenderer>
      ),
    },
    { key: 'network', name: 'Network' },
    { key: 'app', name: 'App' },
    { key: 'coins', name: 'Coins' },
  ]);
};
