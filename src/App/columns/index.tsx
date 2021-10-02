import sortedUniq from 'lodash/sortedUniq';
import { ChangeFilterValue } from '../types/ChangeFilterValue';
import { Column } from '../types/Column';
import { Row } from '../types/Row';
import createAppColumn from './createAppColumn';
import createCoinsColumn from './createCoinsColumn';
import createNetworkColumn from './createNetworkColumn';
import createTotalApyColumn from './createTotalApyColumn';
import createTvlColumn from './createTvlColumn';
import createTypesColumn from './createTypesColumn';

export default (
  allRows: readonly Row[],
  changeFilterValue: ChangeFilterValue,
) : Column[] => {
  const networks = sortedUniq(
    allRows.map(({ network }) => network).sort(),
  );
  const apps = sortedUniq(
    allRows.map(({ app }) => app).sort(),
  );
  const coins = sortedUniq(
    allRows
      .map(({ coin1, coin2 }) => (coin2 ? [coin1, coin2] : [coin1]))
      .flat()
      .sort(),
  );

  const types = sortedUniq(
    allRows
      .map((row) => row.types)
      .flat()
      .filter((x) => x)
      .sort(),
  );

  return [
    createTotalApyColumn((newValue) => changeFilterValue('totalApy', newValue)),
    createTvlColumn((newValue) => changeFilterValue('tvl', newValue)),
    createNetworkColumn(networks, (newValue) => changeFilterValue('networks', newValue)),
    createAppColumn(apps, (newValue) => changeFilterValue('apps', newValue)),
    createCoinsColumn(coins, (newValue) => changeFilterValue('coins', newValue)),
    createTypesColumn(types, (newValue) => changeFilterValue('types', newValue)),
  ];
};
