import { useEffect } from 'react';

const isScrollInsideFocusedNumberInput = () => {
  const lastElementUnderMouse = [...document.querySelectorAll(':hover')].pop();

  const isLastElementUnderMouseNumberInput = lastElementUnderMouse
      instanceof HTMLInputElement && lastElementUnderMouse.type === 'number';

  return isLastElementUnderMouseNumberInput && document.activeElement === lastElementUnderMouse;
};

const cancelPageScrollOnNumberInput = (e: Event) => {
  if (isScrollInsideFocusedNumberInput()) {
    e.stopPropagation();
  }
};

export default () => useEffect(() => {
  document.addEventListener('wheel', cancelPageScrollOnNumberInput, { passive: false });
  return () => {
    document.body.removeEventListener('wheel', cancelPageScrollOnNumberInput);
  };
}, []);
