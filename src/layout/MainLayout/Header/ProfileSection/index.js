import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { startsWith } from 'lodash';
// material
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Chip,
  ClickAwayListener,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
// icon
import { Icon } from '@iconify/react';
import settings2Outline from '@iconify/icons-eva/settings-2-outline';
import personEdit20Regular from '@iconify/icons-fluent/person-edit-20-regular';
import signOut24Regular from '@iconify/icons-fluent/sign-out-24-regular';
// component
import { MainCard } from 'components/ui/cards';
import { Transitions } from 'components/ui/extended';
// helper
import { getAuthUser, removeAuthData } from 'helpers/storage';
// config
import { path } from 'config/path';

const ProfileSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const matchSM = useMediaQuery((theme) => theme.breakpoints.up('sm'));
  // data
  const [open, setOpen] = useState(false);
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);
  const handleLogout = async () => {
    removeAuthData();
    navigate(path.urls.login);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };
  const handleListItemClick = (event, route = '') => {
    handleClose(event);
    if (route && route !== '') {
      navigate(route);
    }
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.tennis.light,
          backgroundColor: theme.palette.tennis.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.tennis.main,
            background: `${theme.palette.tennis.main}!important`,
            color: theme.palette.tennis.light,
            '& svg': {
              stroke: theme.palette.tennis.light,
            },
          },
          '& .MuiChip-label': {
            lineHeight: 0,
            pr: { xs: 0, sm: 1.5 },
          },
        }}
        icon={
          <Avatar
            sx={{
              ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer',
              backgroundColor: theme.palette.tennis.dark,
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup='true'
            color='inherit'
          />
        }
        label={matchSM && <Icon icon={settings2Outline} width='24' />}
        variant='outlined'
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup='true'
        onClick={handleToggle}
      />
      <Popper
        placement='bottom-end'
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  border={false}
                  elevation={16}
                  content={false}
                  boxShadow
                  shadow={theme.shadows[16]}
                >
                  <Box sx={{ px: 3, pt: 3 }}>
                    <Stack direction='row' spacing={0.5} alignItems='center'>
                      <Typography variant='h4' sx={{ fontWeight: 700 }}>
                        안녕하세요,
                      </Typography>
                      <Typography
                        component='span'
                        variant='h4'
                        sx={{ fontWeight: 400 }}
                      >
                        {startsWith(getAuthUser().name, '010')
                          ? getAuthUser().name.substring(
                              getAuthUser().name.length - 4,
                              getAuthUser().name.length
                            )
                          : getAuthUser().name}
                        님
                      </Typography>
                    </Stack>
                    <Divider />
                  </Box>

                  <Box sx={{ p: 2 }}>
                    <List
                      component='nav'
                      sx={{
                        p: 0,
                        width: '100%',
                        maxWidth: 350,
                        minWidth: 300,
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: '10px',
                        [theme.breakpoints.down('md')]: {
                          minWidth: '100%',
                        },
                        '& .MuiListItemButton-root': {
                          mt: 0.5,
                        },
                      }}
                    >
                      <ListItemButton
                        onClick={(e) =>
                          handleListItemClick(e, path.urls.profile)
                        }
                        sx={{ borderRadius: '12px' }}
                      >
                        <ListItemIcon>
                          <Icon icon={personEdit20Regular} width='22' />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant='body2'>
                              회원 정보 수정
                            </Typography>
                          }
                        />
                      </ListItemButton>
                      <ListItemButton
                        sx={{
                          borderRadius: '12px',
                        }}
                        onClick={handleLogout}
                      >
                        <ListItemIcon>
                          <Icon icon={signOut24Regular} width='24' />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant='body2'>로그아웃</Typography>
                          }
                        />
                      </ListItemButton>
                    </List>
                  </Box>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
