import React from 'react';
import { FILTER_COLUMN_CLASS_NAME } from '../constants';
import { Column } from '../types/Column';
import CustomAutocomplete from './CustomAutocomplete';
import wrapInFilterRenderer from './parts/wrapInFilterRenderer';

const createAppColumn = (
  apps: string[],
  onChange: (newValue: string[]) => void,
) : Column => (
  {
    key: 'app',
    name: 'App',
    headerCellClass: FILTER_COLUMN_CLASS_NAME,
    headerRenderer: (props) => wrapInFilterRenderer(props, ({ filters }) => (
      <CustomAutocomplete
        options={apps}
        value={filters.apps}
        onChange={onChange}
      />
    )),
  }
);

export default createAppColumn;
