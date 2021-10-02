import React from 'react';
import { HeaderRendererProps } from 'react-data-grid';
import FilterRenderer, { FilterRendererChildren } from '../../FilterRenderer/FilterRenderer';
import { Row } from '../../types/Row';

const wrapInFilterRenderer = (
  {
    isCellSelected,
    column,
    onSort,
    sortDirection,
    priority,
    allRowsSelected,
    onAllRowsSelectionChange,
  }: HeaderRendererProps<Row>,
  children: FilterRendererChildren<HTMLInputElement>,
) => (
  <FilterRenderer<Row, unknown, HTMLInputElement>
    isCellSelected={isCellSelected}
    column={column}
    onSort={onSort}
    sortDirection={sortDirection}
    priority={priority}
    allRowsSelected={allRowsSelected}
    onAllRowsSelectionChange={onAllRowsSelectionChange}
  >
    {children}
  </FilterRenderer>
);

export default wrapInFilterRenderer;
