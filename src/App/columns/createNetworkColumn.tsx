import React from 'react';
import { FILTER_COLUMN_CLASS_NAME } from '../constants';
import { Column } from '../types/Column';
import CustomAutocomplete from './CustomAutocomplete';
import wrapInFilterRenderer from './parts/wrapInFilterRenderer';

const createNetworkColumn = (
  networks: string[],
  onChange: (newValue: string[]) => void,
) : Column => (
  {
    key: 'network',
    name: 'Network',
    headerCellClass: FILTER_COLUMN_CLASS_NAME,
    headerRenderer: (props) => wrapInFilterRenderer(props, ({ filters }) => (
      <CustomAutocomplete
        options={networks}
        value={filters.networks}
        onChange={onChange}
      />
    )),
  }
);

export default createNetworkColumn;
