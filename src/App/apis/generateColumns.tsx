import { uniq } from 'lodash';
import React from 'react';
import Network from '../enums/Network';
import FilterRenderer from '../FilterRenderer/FilterRenderer';
import { AnyColumn } from '../types/Column';
import { Filter } from '../types/Filter';
import { Row } from '../types/Row';

// TODO inline css or use constants
const FILTER_COLUMN_CLASS_NAME = 'filter-cell';

function inputStopPropagation(event: React.KeyboardEvent<HTMLElement>) {
  if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.stopPropagation();
  }
}

function inputNumberStopPropagation(event: React.KeyboardEvent<HTMLElement>) {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
    event.stopPropagation();
  }
}

const selectStopPropagation = inputNumberStopPropagation;

export default (rows: Row[], setFilters: (filter: Filter) => void): AnyColumn[] => {
  // TODO filter in real time from sortedFilteredRows

  const networks = uniq(rows.map(({ network }) => network)).sort();
  const apps = uniq(rows.map(({ app }) => app)).sort();
  const coins = uniq(rows.map((row) => row.coins.split('/')).flat()).sort();

  return [
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
    {
      key: 'network',
      name: 'Network',
      headerCellClass: FILTER_COLUMN_CLASS_NAME,
      headerRenderer: (props) => (
        // TODO
        // eslint-disable-next-line react/jsx-props-no-spreading
        <FilterRenderer<Row, unknown, HTMLSelectElement> {...props}>
          {({ filters, ...rest }) => (
            <select
                    // TODO
                    // eslint-disable-next-line react/jsx-props-no-spreading
              {...rest}
              value={filters.network}
              onChange={(e) => setFilters({
                ...filters,
                network: e.target.value,
              })}
              onKeyDown={selectStopPropagation}
            >
              <option value={Network.ALL} key={Network.ALL}>
                All
              </option>

              {networks.map((network) => (
                <option key={network} value={network}>
                  {network}
                </option>
              ))}

            </select>

          )}
        </FilterRenderer>
      ),
    },
    {
      key: 'app',
      name: 'App',
      headerCellClass: FILTER_COLUMN_CLASS_NAME,
      headerRenderer: (props) => (
        // TODO
        // eslint-disable-next-line react/jsx-props-no-spreading
        <FilterRenderer<Row, unknown, HTMLInputElement> {...props}>
          {({ filters, ...rest }) => (
            <>
              <input
                      // TODO
                      // eslint-disable-next-line react/jsx-props-no-spreading
                {...rest}
                value={filters.app}
                onChange={(e) => setFilters({
                  ...filters,
                  app: e.target.value,
                })}
                onKeyDown={inputStopPropagation}
                list="apps"
              />
              <datalist id="apps">
                {apps.map((app: string) => (
                  <option value={app} key={app}>{app}</option>
                ))}
              </datalist>
            </>
          )}
        </FilterRenderer>
      ),
    },
    {
      key: 'coins',
      name: 'Coins',
      headerCellClass: FILTER_COLUMN_CLASS_NAME,
      headerRenderer: (props) => (
        // TODO
        // eslint-disable-next-line react/jsx-props-no-spreading
        <FilterRenderer<Row, unknown, HTMLInputElement> {...props}>
          {({ filters, ...rest }) => (
            <>
              <input
                      // TODO
                      // eslint-disable-next-line react/jsx-props-no-spreading
                {...rest}
                value={filters.coins}
                onChange={(e) => setFilters({
                  ...filters,
                  coins: e.target.value,
                })}
                onKeyDown={inputStopPropagation}
                list="coins"
              />
              <datalist id="coins">
                {coins.map((coin: string) => (
                  <option value={coin} key={coin}>{coin}</option>
                ))}
              </datalist>
            </>
          )}
        </FilterRenderer>
      ),
    },
  ];
};
