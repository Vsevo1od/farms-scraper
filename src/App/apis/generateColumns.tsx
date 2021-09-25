import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import sortedUniq from 'lodash/sortedUniq';
import React from 'react';
import { AUTOCOMPLETE_CLASS_NAME, FILTER_COLUMN_CLASS_NAME } from '../constants';
import FilterRenderer from '../FilterRenderer/FilterRenderer';
import { AnyColumn } from '../types/Column';
import { Filters } from '../types/Filters';
import { Row } from '../types/Row';

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
  rowsToShow: Row[],
  setFilters: (filters: Filters) => void,
) : AnyColumn[] => {
  const networks = sortedUniq(
    allRows.map(({ network }) => network).sort(),
  );
  const apps = sortedUniq(
    rowsToShow.map(({ app }) => app).sort(),
  );
  const coins = sortedUniq(
    rowsToShow.map((row) => row.coins.split('/')).flat().sort(),
  );

  return [
    {
      key: 'totalApyFormatted',
      name: 'Total APY',
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
          {({ filters: theFilters, tabIndex, ref }) => (
            <>
              <input
                tabIndex={tabIndex}
                ref={ref}
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
            <>
              <input
                tabIndex={tabIndex}
                ref={ref}
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
