import { TextField } from '@mui/material';
import React, { useContext } from 'react';
import { FILTER_COLUMN_CLASS_NAME } from '../constants';
import MaxApyContext from '../contexts/MaxApyContext';
import { Column } from '../types/Column';
import { Row } from '../types/Row';
import inputNumberStopPropagation from './parts/inputNumberStopPropagation';
import wrapInFilterRenderer from './parts/wrapInFilterRenderer';

const compactNumberFormatter = new Intl.NumberFormat('en', { notation: 'compact' });
const scientificNumberFormatter = new Intl.NumberFormat('en', { notation: 'scientific' });

const createTotalApyColumn = (onChange: (newValue: number) => void): Column => ({
  key: 'totalApy',
  name: 'APY',
  headerCellClass: FILTER_COLUMN_CLASS_NAME,
  headerRenderer: (props) => wrapInFilterRenderer(
    props, ({ filters: theFilters, tabIndex, ref }) => (
      <TextField
        tabIndex={tabIndex}
        ref={ref}
        type="number"
        size="small"
        InputProps={{ inputProps: { min: 0 } }}
        value={theFilters.totalApy}
        onChange={({ target: { valueAsNumber } }: React.ChangeEvent<HTMLInputElement>) => {
          onChange(Number.isFinite(valueAsNumber) ? valueAsNumber : 0);
        }}
        onKeyDown={inputNumberStopPropagation}
      />
    ),
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
});

export default createTotalApyColumn;
