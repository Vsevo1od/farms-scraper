import { AUTOCOMPLETE_CLASS_NAME, LINE_HEIGHT_PX } from '../constants';

export default () => {
  const autocompleteHeights = [...document.querySelectorAll(`.${AUTOCOMPLETE_CLASS_NAME}`)]
    .map((el) => getComputedStyle(el))
    .map(({ height }) => parseInt(height, 10));
  const maxAutocompleteHeight = Math.max(...autocompleteHeights, LINE_HEIGHT_PX);
  const titleHeight = LINE_HEIGHT_PX;
  const paddingBottom = 10;

  return titleHeight + maxAutocompleteHeight + paddingBottom;
};
