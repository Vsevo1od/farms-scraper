import React from 'react';
import sortedUniq from 'lodash/sortedUniq';
import Network from '../enums/Network';
import FilterRenderer from '../FilterRenderer/FilterRenderer';
import { AnyColumn } from '../types/Column';
import { Filters } from '../types/Filters';
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

const getNetworksToShow = (rows: Row[], selectedNetwork: string): string[] => {
  const networksToShowWithDuplicates = rows.map(({ network }) => network);
  if (selectedNetwork && selectedNetwork !== Network.ALL) {
    networksToShowWithDuplicates.push(selectedNetwork);
  }

  return sortedUniq(networksToShowWithDuplicates.sort());
};

export default (rows: Row[], filters: Filters, setFilters: (filters: Filters) => void)
: AnyColumn[] => {
  // TODO filter in real time from sortedFilteredRows

  const networks = getNetworksToShow(rows, filters.network);
  const apps = sortedUniq(
    rows.map(({ app }) => app).sort(),
  );
  const coins = sortedUniq(
    rows.map((row) => row.coins.split('/')).flat().sort(),
  );

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
          {({ filters: theFilters, ...rest }) => (
            <select
                    // TODO
                    // eslint-disable-next-line react/jsx-props-no-spreading
              {...rest}
              value={theFilters.network}
              onChange={(e) => setFilters({
                ...theFilters,
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
          {({ filters: theFilters, ...rest }) => (
            <>
              <input
                      // TODO
                      // eslint-disable-next-line react/jsx-props-no-spreading
                {...rest}
                value={theFilters.app}
                onChange={(e) => setFilters({
                  ...theFilters,
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
          {({ filters: theFilters, ...rest }) => (
            <>
              <input
                      // TODO
                      // eslint-disable-next-line react/jsx-props-no-spreading
                {...rest}
                value={theFilters.coins}
                onChange={(e) => setFilters({
                  ...theFilters,
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
