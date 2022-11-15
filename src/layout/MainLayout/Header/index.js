import PropTypes from 'prop-types';
// material
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  ButtonBase,
  Typography,
  useMediaQuery,
} from '@mui/material';
// icon
import { Icon } from '@iconify/react';
import menuFill from '@iconify/icons-eva/menu-fill';
// graphql
import { useReactiveVar } from '@apollo/client';
// helpers
import { storeDataVar } from 'helpers/cache';
// project imports
// import BarcodeSection from './Barcode';
import HomeSection from './Home';
import LogoSection from '../LogoSection';
// import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
// import NotificationSection from './NotificationSection';

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();
  const storeData = useReactiveVar(storeDataVar);
  const matchXS = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto',
          },
        }}
      >
        <Box
          component='span'
          sx={{ display: { xs: 'none', md: 'block' }, mx: 'auto' }}
        >
          <LogoSection />
        </Box>
        <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <Avatar
            variant='rounded'
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.tennis.light,
              color: theme.palette.common.black,
              '&:hover': {
                background: theme.palette.tennis.dark,
                color: theme.palette.tennis.light,
              },
            }}
            onClick={handleLeftDrawerToggle}
            color='inherit'
          >
            <Icon icon={menuFill} />
          </Avatar>
        </ButtonBase>
      </Box>
      {/* header search */}
      {/* <SearchSection /> */}
      <Box sx={{ flexGrow: 1 }} />
      <HomeSection />
      <Typography variant={matchXS ? 'h4' : 'h3'} sx={{ fontWeight: 700 }}>
        {storeData.name}
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      {/* notification & profile */}
      {/* <BarcodeSection /> */}
      {/* <NotificationSection /> */}
      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func,
};

export default Header;
