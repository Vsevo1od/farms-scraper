import React from 'react';
import { FILTER_COLUMN_CLASS_NAME } from '../constants';
import { Column } from '../types/Column';
import CustomAutocomplete from './CustomAutocomplete';
import wrapInFilterRenderer from './parts/wrapInFilterRenderer';

const createCoinsColumn = (
  coins: string[],
  onChange: (newValue: string[]) => void,
) : Column => (
  {
    key: 'coinsFormatted',
    name: 'Coins',
    headerCellClass: FILTER_COLUMN_CLASS_NAME,
    headerRenderer: (props) => wrapInFilterRenderer(props, ({ filters }) => (
      <CustomAutocomplete
        options={coins}
        value={filters.coins}
        onChange={onChange}
      />
    )),
  }
);

export default createCoinsColumn;
