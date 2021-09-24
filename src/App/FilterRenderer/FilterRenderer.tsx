import React, { createContext, useContext } from 'react';
import { HeaderRendererProps } from 'react-data-grid';
import useFocusRef from '../../utils/useFocusRef';
import { ARROW_CLASS_NAME } from '../constants';
import { Filters } from '../types/Filters';

// Context is needed to read filter values otherwise columns are
// re-created when filters are changed and filter loses focus
export const FilterContext = createContext<Filters | undefined>(undefined);

function FilterRenderer<R, SR, T extends HTMLOrSVGElement>({
  isCellSelected,
  column,
  children,
  onSort,
  sortDirection,
  priority,
}: HeaderRendererProps<R, SR> & {
  children: (args: {
    ref: React.RefObject<T>;
    tabIndex: number;
    filters: Filters;
  }) => React.ReactElement;
}) {
  const filters = useContext(FilterContext)!;
  const { ref, tabIndex } = useFocusRef<T>(isCellSelected);

  function handleKeyDown(event: React.KeyboardEvent<HTMLSpanElement>) {
    if (event.key === ' ' || event.key === 'Enter') {
      // stop propagation to prevent scrolling
      event.preventDefault();
      onSort(event.ctrlKey || event.metaKey);
    }
  }

  function handleClick(event: React.MouseEvent<HTMLSpanElement>) {
    onSort(event.ctrlKey || event.metaKey);
  }

  return (
    <>
      <div
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
        {column.name}
        {sortDirection !== undefined && (
          <svg viewBox="0 0 12 8" width="12" height="8" className={ARROW_CLASS_NAME} aria-hidden>
            <path d={sortDirection === 'ASC' ? 'M0 8 6 0 12 8' : 'M0 0 6 8 12 0'} />
          </svg>
        )}
        {priority}
      </div>
      {filters.enabled && <div>{children({ ref, tabIndex, filters })}</div>}
    </>
  );
}

export default FilterRenderer;
