import { Filters } from './Filters';

export type ChangeFilterValue = <T extends keyof Filters>(filter: T, newValue: Filters[T]) => void;
