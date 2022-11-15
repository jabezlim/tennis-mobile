// material
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
// routes
import Router from 'routes';
// theme
import theme from 'theme';
// project imports
import NavigationScroll from 'layout/NavigationScroll';

const App = () => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme()}>
        <CssBaseline />
        <NavigationScroll>
          <Router />
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
