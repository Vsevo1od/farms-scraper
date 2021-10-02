import { TextField } from '@mui/material';
import React from 'react';
import { FILTER_COLUMN_CLASS_NAME } from '../constants';
import { Column } from '../types/Column';
import inputNumberStopPropagation from './parts/inputNumberStopPropagation';
import wrapInFilterRenderer from './parts/wrapInFilterRenderer';

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const createTvlColumn = (onChange: (newValue: number) => void): Column => (
  {
    key: 'tvl',
    name: 'TVL $',
    headerCellClass: FILTER_COLUMN_CLASS_NAME,
    headerRenderer: (props) => wrapInFilterRenderer(
      props, ({ filters: theFilters, tabIndex, ref }) => (
        <TextField
          tabIndex={tabIndex}
          ref={ref}
          type="number"
          size="small"
          InputProps={{ inputProps: { min: 0 } }}
          value={theFilters.tvl}
          onChange={({ target: { valueAsNumber } }: React.ChangeEvent<HTMLInputElement>) => {
            onChange(Number.isFinite(valueAsNumber) ? valueAsNumber : 0);
          }}
          onKeyDown={inputNumberStopPropagation}
        />
      ),
    ),
    formatter({ row }) {
      const text = row.tvl ? moneyFormatter.format(row.tvl) : '';
      return (<span>{ text }</span>);
    },
  });

export default createTvlColumn;
