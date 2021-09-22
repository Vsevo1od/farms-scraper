import React, { createContext, useContext } from 'react';
import { HeaderRendererProps } from 'react-data-grid';
import useFocusRef from '../../utils/useFocusRef';
import { Filter } from '../types/Filter';

// Context is needed to read filter values otherwise columns are
// re-created when filters are changed and filter loses focus
export const FilterContext = createContext<Filter | undefined>(undefined);

function FilterRenderer<R, SR, T extends HTMLOrSVGElement>({
  isCellSelected,
  column,
  children,
}: HeaderRendererProps<R, SR> & {
  children: (args: {
    ref: React.RefObject<T>;
    tabIndex: number;
    filters: Filter;
  }) => React.ReactElement;
}) {
  const filters = useContext(FilterContext)!;
  const { ref, tabIndex } = useFocusRef<T>(isCellSelected);

  return (
    <>
      <div>{column.name}</div>
      {filters.enabled && <div>{children({ ref, tabIndex, filters })}</div>}
    </>
  );
}

export default FilterRenderer;
