import React from 'react';
import { FILTER_COLUMN_CLASS_NAME } from '../constants';
import { Column } from '../types/Column';
import CustomAutocomplete from './CustomAutocomplete';
import wrapInFilterRenderer from './parts/wrapInFilterRenderer';

const createTypesColumn = (
  types: string[],
  onChange: (newValue: string[]) => void,
) : Column => (
  {
    key: 'types',
    name: 'Types',
    headerCellClass: FILTER_COLUMN_CLASS_NAME,
    headerRenderer: (props) => wrapInFilterRenderer(props, ({ filters }) => (
      <CustomAutocomplete
        options={types}
        value={filters.types}
        onChange={onChange}
      />
    )),
  }
);

export default createTypesColumn;
