import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { MobileView } from 'react-device-detect';
// material
import { styled, useTheme } from '@mui/material/styles';
import {
  AppBar,
  Box,
  CssBaseline,
  Fab,
  Toolbar,
  useMediaQuery,
} from '@mui/material';
// icon
import { Icon } from '@iconify/react';
import chevronUp24Filled from '@iconify/icons-fluent/chevron-up-24-filled';
// context
import { useGlobalContext } from 'context';
// config
import { drawerWidth } from 'config/constants';
// project imports
import Header from './Header';
import Sidebar from './Sidebar';
import BackToTop from './BackToTop';
import { MessageModal } from 'components/ui/modal';
import Footer from './Footer';

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    ...theme.typography.mainContent,
    ...(!open && {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      [theme.breakpoints.up('md')]: {
        marginLeft: -(drawerWidth - 20),
        width: `calc(100% - ${drawerWidth}px)`,
      },
      [theme.breakpoints.down('md')]: {
        marginLeft: 20,
        width: `calc(100% - ${drawerWidth}px)`,
        padding: 16,
      },
      [theme.breakpoints.down('sm')]: {
        marginTop: 80,
        marginLeft: 0,
        marginRight: 0,
        width: `calc(100% - ${drawerWidth}px)`,
        padding: 10,
      },
    }),
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      width: `calc(100% - ${drawerWidth}px)`,
      [theme.breakpoints.down('md')]: {
        marginLeft: 20,
      },
      [theme.breakpoints.down('sm')]: {
        marginLeft: 10,
      },
    }),
  })
);

const MainLayout = () => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('lg'));
  const { menu, settingMenu } = useGlobalContext();

  // Handle left drawer
  const leftDrawerOpened = menu.opened;
  const handleLeftDrawerToggle = () => {
    settingMenu('set_menu', !leftDrawerOpened);
  };

  useEffect(() => {
    settingMenu('set_menu', !matchDownMd);
    // eslint-disable-next-line
  }, [matchDownMd]);

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        {/* header */}
        <AppBar
          enableColorOnDark
          position='fixed'
          color='inherit'
          elevation={0}
          sx={{
            bgcolor: theme.palette.background.default,
            transition: leftDrawerOpened
              ? theme.transitions.create('width')
              : 'none',
          }}
        >
          <Toolbar>
            <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
          </Toolbar>
        </AppBar>

        {/* drawer */}
        <Sidebar
          drawerOpen={leftDrawerOpened}
          drawerToggle={handleLeftDrawerToggle}
        />

        {/* main content */}
        <Main theme={theme} open={leftDrawerOpened}>
          <Outlet />
        </Main>
        <MobileView>
          <BackToTop>
            <Fab
              size='small'
              aria-label='scroll back to top'
              sx={{
                backgroundColor: 'tennis.main',
                '&:hover': { backgroundColor: 'tennis.main' },
              }}
            >
              <Icon icon={chevronUp24Filled} />
            </Fab>
          </BackToTop>
        </MobileView>
      </Box>
      <Footer open={leftDrawerOpened} />
      <MessageModal />
    </>
  );
};

export default MainLayout;
