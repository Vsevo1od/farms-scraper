import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import React from 'react';
import {
  Autocomplete, Checkbox, createFilterOptions, TextField,
} from '@mui/material';
import { AUTOCOMPLETE_CLASS_NAME } from '../constants';
import inputStopPropagation from './parts/inputStopPropagation';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

// See https://github.com/mui-org/material-ui/issues/17001
const SELECT_ITEMS_LIMIT = 30;

function CustomAutocomplete(props: {
  options: string[],
  value: string[],
  onChange: (newValue: string[]) => void,
}) {
  const { options, value, onChange } = props;
  return (
    <Autocomplete
      multiple
      size="small"
      options={options}
      disableCloseOnSelect
      getOptionLabel={(option) => option}
      className={AUTOCOMPLETE_CLASS_NAME}
      value={value}
      onChange={(event: unknown, newValue: string[]) => onChange(newValue)}
      renderOption={(liProps, option, { selected }) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <li {...liProps}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            checked={selected}
          />
          {option}
        </li>
      )}
      renderInput={(params) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <TextField {...params} />
      )}
      onKeyDown={inputStopPropagation}
      filterOptions={createFilterOptions({ limit: SELECT_ITEMS_LIMIT })}
    />
  );
}

export default CustomAutocomplete;
