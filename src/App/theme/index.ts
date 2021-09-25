import { createTheme } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
const lightTheme = createTheme();

export default window.matchMedia('(prefers-color-scheme: dark)').matches ? darkTheme : lightTheme;
