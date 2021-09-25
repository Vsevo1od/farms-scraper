import { createContext } from 'react';
// Context is needed to read maxApy values otherwise columns are
// re-created when filters are changed and filter loses focus
export default createContext<number>(0);
