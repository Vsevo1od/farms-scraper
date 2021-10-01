import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import sortedUniq from 'lodash/sortedUniq';
import React, { useContext } from 'react';
import { AUTOCOMPLETE_CLASS_NAME, FILTER_COLUMN_CLASS_NAME } from '../constants';
import MaxApyContext from '../contexts/MaxApyContext';
import FilterRenderer from '../FilterRenderer/FilterRenderer';
import { Column } from '../types/Column';
import { Filters } from '../types/Filters';
import { Row } from '../types/Row';

// See https://github.com/mui-org/material-ui/issues/17001
const SELECT_ITEMS_LIMIT = 30;

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

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default (
  allRows: readonly Row[],
  setFilters: (filters: Filters) => void,
) : Column[] => {
  const networks = sortedUniq(
    allRows.map(({ network }) => network).sort(),
  );
  const apps = sortedUniq(
    allRows.map(({ app }) => app).sort(),
  );
  const coins = sortedUniq(
    allRows
      .map(({ coin1, coin2 }) => (coin2 ? [coin1, coin2] : [coin1]))
      .flat()
      .sort(),
  );

  const types = sortedUniq(
    allRows
      .map((row) => row.types)
      .flat()
      .filter((x) => x)
      .sort(),
  );

  const moneyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',

    maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  const compactNumberFormatter = new Intl.NumberFormat('en', { notation: 'compact' });
  const scientificNumberFormatter = new Intl.NumberFormat('en', { notation: 'scientific' });

  return [
    {
      key: 'totalApy',
      name: 'APY',
      headerCellClass: FILTER_COLUMN_CLASS_NAME,
      headerRenderer: ({
        isCellSelected,
        column,
        onSort,
        sortDirection,
        priority,
        allRowsSelected,
        onAllRowsSelectionChange,
      }) => (
        <FilterRenderer<Row, unknown, HTMLInputElement>
          isCellSelected={isCellSelected}
          column={column}
          onSort={onSort}
          sortDirection={sortDirection}
          priority={priority}
          allRowsSelected={allRowsSelected}
          onAllRowsSelectionChange={onAllRowsSelectionChange}
        >
          {({ filters: theFilters, tabIndex, ref }) => (
            <TextField
              tabIndex={tabIndex}
              ref={ref}
              type="number"
              size="small"
              InputProps={{ inputProps: { min: 0 } }}
              value={theFilters.totalApy}
              onChange={({ target: { valueAsNumber } }: React.ChangeEvent<HTMLInputElement>) => {
                setFilters({
                  ...theFilters,
                  totalApy: Number.isFinite(valueAsNumber) ? valueAsNumber : 0,
                });
              }}
              onKeyDown={inputNumberStopPropagation}
            />
          )}
        </FilterRenderer>
      ),
      cellClass(row: Row) {
        const maxApy = useContext(MaxApyContext);
        const fractionOfMaxApy = row.totalApy / maxApy;
        const percentOfMaxApy = Math.floor(fractionOfMaxApy * 100);
        const percentOfMaxApyFlooredToNearest5 = Math.floor(percentOfMaxApy / 5) * 5;

        return `anti-gradient-${percentOfMaxApyFlooredToNearest5}`;
      },
      formatter({ row }) {
        const formattedApy = row.totalApy < 1e15
          ? compactNumberFormatter.format(row.totalApy)
          : scientificNumberFormatter.format(row.totalApy);
        return (<span>{ `${formattedApy}%` }</span>);
      },
    },
    {
      key: 'tvl',
      name: 'TVL $',
      headerCellClass: FILTER_COLUMN_CLASS_NAME,
      headerRenderer: ({
        isCellSelected,
        column,
        onSort,
        sortDirection,
        priority,
        allRowsSelected,
        onAllRowsSelectionChange,
      }) => (
        <FilterRenderer<Row, unknown, HTMLInputElement>
          isCellSelected={isCellSelected}
          column={column}
          onSort={onSort}
          sortDirection={sortDirection}
          priority={priority}
          allRowsSelected={allRowsSelected}
          onAllRowsSelectionChange={onAllRowsSelectionChange}
        >
          {({ filters: theFilters, tabIndex, ref }) => (
            <TextField
              tabIndex={tabIndex}
              ref={ref}
              type="number"
              size="small"
              InputProps={{ inputProps: { min: 0 } }}
              value={theFilters.tvl}
              onChange={({ target: { valueAsNumber } }: React.ChangeEvent<HTMLInputElement>) => {
                setFilters({
                  ...theFilters,
                  tvl: Number.isFinite(valueAsNumber) ? valueAsNumber : 0,
                });
              }}
              onKeyDown={inputNumberStopPropagation}
            />
          )}
        </FilterRenderer>
      ),
      formatter({ row }) {
        const text = row.tvl ? moneyFormatter.format(row.tvl) : '';
        return (<span>{ text }</span>);
      },
    },
    {
      key: 'network',
      name: 'Network',
      headerCellClass: FILTER_COLUMN_CLASS_NAME,
      headerRenderer: ({
        isCellSelected,
        column,
        onSort,
        sortDirection,
        priority,
        allRowsSelected,
        onAllRowsSelectionChange,
      }) => (
        <FilterRenderer<Row, unknown, HTMLSelectElement>
          isCellSelected={isCellSelected}
          column={column}
          onSort={onSort}
          sortDirection={sortDirection}
          priority={priority}
          allRowsSelected={allRowsSelected}
          onAllRowsSelectionChange={onAllRowsSelectionChange}
        >
          {({ filters: theFilters }) => (
            <Autocomplete
              multiple
              size="small"
              options={networks}
              disableCloseOnSelect
              getOptionLabel={(option) => option}
              className={AUTOCOMPLETE_CLASS_NAME}
              value={theFilters.networks}
              onChange={(event: unknown, newValue: string[]) => setFilters({
                ...theFilters,
                networks: newValue,
              })}
              renderOption={(props, option, { selected }) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    checked={selected}
                  />
                  {option}
                </li>
              )}
              renderInput={(params) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
                <TextField {...params} />
              )}
            />
          )}
        </FilterRenderer>
      ),
    },
    {
      key: 'app',
      name: 'App',
      headerCellClass: FILTER_COLUMN_CLASS_NAME,
      headerRenderer: ({
        isCellSelected,
        column,
        onSort,
        sortDirection,
        priority,
        allRowsSelected,
        onAllRowsSelectionChange,
      }) => (
        <FilterRenderer<Row, unknown, HTMLInputElement>
          isCellSelected={isCellSelected}
          column={column}
          onSort={onSort}
          sortDirection={sortDirection}
          priority={priority}
          allRowsSelected={allRowsSelected}
          onAllRowsSelectionChange={onAllRowsSelectionChange}
        >
          {({ filters: theFilters }) => (
            <Autocomplete
              multiple
              size="small"
              options={apps}
              disableCloseOnSelect
              getOptionLabel={(option) => option}
              className={AUTOCOMPLETE_CLASS_NAME}
              value={theFilters.apps}
              onChange={(event: unknown, newValue: string[]) => setFilters({
                ...theFilters,
                apps: newValue,
              })}
              renderOption={(props, option, { selected }) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    checked={selected}
                  />
                  {option}
                </li>
              )}
              renderInput={(params) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
                <TextField {...params} />
              )}
              onKeyDown={inputStopPropagation}
              filterOptions={createFilterOptions({ limit: SELECT_ITEMS_LIMIT })}
            />
          )}
        </FilterRenderer>
      ),
    },
    {
      key: 'coinsFormatted',
      name: 'Coins',
      headerCellClass: FILTER_COLUMN_CLASS_NAME,
      headerRenderer: ({
        isCellSelected,
        column,
        onSort,
        sortDirection,
        priority,
        allRowsSelected,
        onAllRowsSelectionChange,
      }) => (
        <FilterRenderer<Row, unknown, HTMLInputElement>
          isCellSelected={isCellSelected}
          column={column}
          onSort={onSort}
          sortDirection={sortDirection}
          priority={priority}
          allRowsSelected={allRowsSelected}
          onAllRowsSelectionChange={onAllRowsSelectionChange}
        >
          {({ filters: theFilters }) => (
            <Autocomplete
              multiple
              size="small"
              options={coins}
              disableCloseOnSelect
              getOptionLabel={(option) => option}
              className={AUTOCOMPLETE_CLASS_NAME}
              value={theFilters.coins}
              onChange={(event: unknown, newValue: string[]) => setFilters({
                ...theFilters,
                coins: newValue,
              })}
              renderOption={(props, option, { selected }) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    checked={selected}
                  />
                  {option}
                </li>
              )}
              renderInput={(params) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
                <TextField {...params} />
              )}
              onKeyDown={inputStopPropagation}
              filterOptions={createFilterOptions({ limit: SELECT_ITEMS_LIMIT })}
            />
          )}
        </FilterRenderer>
      ),
    },
    {
      key: 'types',
      name: 'Types',
      headerCellClass: FILTER_COLUMN_CLASS_NAME,
      headerRenderer: ({
        isCellSelected,
        column,
        onSort,
        sortDirection,
        priority,
        allRowsSelected,
        onAllRowsSelectionChange,
      }) => (
        <FilterRenderer<Row, unknown, HTMLInputElement>
          isCellSelected={isCellSelected}
          column={column}
          onSort={onSort}
          sortDirection={sortDirection}
          priority={priority}
          allRowsSelected={allRowsSelected}
          onAllRowsSelectionChange={onAllRowsSelectionChange}
        >
          {({ filters: theFilters }) => (
            <Autocomplete
              multiple
              size="small"
              options={types}
              disableCloseOnSelect
              getOptionLabel={(option) => option}
              className={AUTOCOMPLETE_CLASS_NAME}
              value={theFilters.types}
              onChange={(event: unknown, newValue: string[]) => setFilters({
                ...theFilters,
                types: newValue,
              })}
              renderOption={(props, option, { selected }) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    checked={selected}
                  />
                  {option}
                </li>
              )}
              renderInput={(params) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
                <TextField {...params} />
              )}
              onKeyDown={inputStopPropagation}
              filterOptions={createFilterOptions({ limit: SELECT_ITEMS_LIMIT })}
            />
          )}
        </FilterRenderer>
      ),
    },
  ];
};
