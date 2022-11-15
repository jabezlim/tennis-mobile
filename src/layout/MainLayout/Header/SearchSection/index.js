import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
// material
import { useTheme, styled } from '@mui/material/styles';
import { shouldForwardProp } from '@mui/system';
import {
  Avatar,
  Box,
  ButtonBase,
  Card,
  Grid,
  InputAdornment,
  OutlinedInput,
  Popper,
} from '@mui/material';
// icon
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import closeFill from '@iconify/icons-eva/close-fill';
// third-party
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';
// components
import { Transitions } from 'components/ui/extended';
// context
import { useGlobalContext } from 'context';
// config
import { path } from 'config/path';
import { isEmpty } from 'lodash';

// styles
const PopperStyle = styled(Popper, { shouldForwardProp })(({ theme }) => ({
  zIndex: 1100,
  width: '99%',
  top: '-55px !important',
  padding: '0 12px',
  [theme.breakpoints.down('sm')]: {
    padding: '0 10px',
  },
}));

const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(
  ({ theme }) => ({
    width: 434,
    marginLeft: 16,
    paddingLeft: 16,
    paddingRight: 16,
    '& input': {
      background: 'transparent !important',
      paddingLeft: '4px !important',
    },
    [theme.breakpoints.down('lg')]: {
      width: 250,
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
      marginLeft: 4,
      background: '#fff',
    },
  })
);

const HeaderAvatarStyle = styled(Avatar, { shouldForwardProp })(
  ({ theme }) => ({
    ...theme.typography.commonAvatar,
    ...theme.typography.mediumAvatar,
    background: theme.palette.secondary.light,
    color: theme.palette.secondary.dark,
    '&:hover': {
      background: theme.palette.secondary.dark,
      color: theme.palette.secondary.light,
    },
  })
);

const MobileSearch = ({ value, setValue, popupState, handleKeyPress }) => {
  const theme = useTheme();

  return (
    <OutlineInputStyle
      autoFocus
      id='input-search-header'
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyPress={handleKeyPress}
      placeholder='Search'
      startAdornment={
        <InputAdornment position='start'>
          <Icon icon={searchFill} />
        </InputAdornment>
      }
      endAdornment={
        <InputAdornment position='end'>
          <ButtonBase sx={{ borderRadius: '12px' }}>
            <Avatar
              variant='rounded'
              sx={{
                ...theme.typography.commonAvatar,
                ...theme.typography.mediumAvatar,
                background: theme.palette.orange.light,
                color: theme.palette.orange.dark,
                '&:hover': {
                  background: theme.palette.orange.dark,
                  color: theme.palette.orange.light,
                },
              }}
              {...bindToggle(popupState)}
            >
              <Icon icon={closeFill} />
            </Avatar>
          </ButtonBase>
        </InputAdornment>
      }
      aria-describedby='search-helper-text'
      inputProps={{ 'aria-label': 'weight' }}
    />
  );
};

MobileSearch.propTypes = {
  value: PropTypes.string,
  setValue: PropTypes.func,
  popupState: PropTypes.object,
  handleKeyPress: PropTypes.func,
};

const SearchSection = () => {
  const theme = useTheme();
  const { pathname } = useLocation();
  // data
  const [value, setValue] = useState('');
  const [show, setShow] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (pathname) {
      setShow(pathname === path.urls.inventoryItems);
    }
  }, [pathname]);

  useEffect(() => {
    const search = searchParams.get('search');
    if (isEmpty(search)) setValue('');
    else setValue(search);
  }, [searchParams]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setSearchParams({ search: e.target.value });
    }
  };

  if (show) {
    return (
      <>
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <PopupState variant='popper' popupId='search-popup-popper'>
            {(popupState) => (
              <>
                <Box sx={{ ml: 2 }}>
                  <ButtonBase sx={{ borderRadius: '12px' }}>
                    <HeaderAvatarStyle
                      variant='rounded'
                      {...bindToggle(popupState)}
                    >
                      <Icon icon={searchFill} />
                    </HeaderAvatarStyle>
                  </ButtonBase>
                </Box>
                <PopperStyle {...bindPopper(popupState)} transition>
                  {({ TransitionProps }) => (
                    <>
                      <Transitions
                        type='zoom'
                        {...TransitionProps}
                        sx={{ transformOrigin: 'center left' }}
                      >
                        <Card
                          sx={{
                            background: '#fff',
                            [theme.breakpoints.down('sm')]: {
                              border: 0,
                              boxShadow: 'none',
                            },
                          }}
                        >
                          <Box sx={{ p: 2 }}>
                            <Grid
                              container
                              alignItems='center'
                              justifyContent='space-between'
                            >
                              <Grid item xs>
                                <MobileSearch
                                  value={value}
                                  setValue={setValue}
                                  popupState={popupState}
                                  handleKeyPress={handleKeyPress}
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        </Card>
                      </Transitions>
                    </>
                  )}
                </PopperStyle>
              </>
            )}
          </PopupState>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <OutlineInputStyle
            id='input-search-header'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder='Search'
            startAdornment={
              <InputAdornment position='start'>
                <Icon icon={searchFill} />
              </InputAdornment>
            }
            aria-describedby='search-helper-text'
            inputProps={{ 'aria-label': 'weight' }}
          />
        </Box>
      </>
    );
  }
  return <></>;
};

export default SearchSection;
