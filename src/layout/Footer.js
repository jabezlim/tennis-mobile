import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// material
import { BottomNavigation, BottomNavigationAction, Stack } from '@mui/material';
// config
import { path } from 'config/path';
import { BookIcon, HomeIcon, LessonIcon, TicketIcon } from 'config/icons';

const Footer = ({ isDialog = false }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // data
  const [value, setValue] = useState();

  useEffect(() => {
    if (!isDialog) {
      setValue(pathname);
    }
    // eslint-disable-next-line
  }, [pathname]);

  return (
    <Stack sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => {
          if (newValue === pathname && isDialog) navigate(0);
        }}
        sx={{
          '& span.Mui-selected': {
            fontWeight: 700,
            fontSize: '0.75rem',
            color: 'tennis.main',
          },
        }}
      >
        <BottomNavigationAction
          label='홈'
          icon={<HomeIcon />}
          value={path.urls.home}
          onClick={() => navigate(path.urls.home)}
        />
        <BottomNavigationAction
          label='코트 예약'
          icon={<BookIcon />}
          value={path.urls.booking}
          onClick={() => navigate(path.urls.booking)}
        />
        <BottomNavigationAction
          label='시설이용권'
          icon={<TicketIcon />}
          sx={{
            mt: 0.1,
            '& .MuiBottomNavigationAction-label': {
              mt: 0.4,
            },
          }}
          value={path.urls.ticketMachine}
          onClick={() => navigate(path.urls.ticketMachine)}
        />
        {/* <BottomNavigationAction
          label='레슨 수강'
          icon={<LessonIcon />}
          value={path.urls.ticketLesson}
          onClick={() => navigate(path.urls.ticketLesson)}
        /> */}
      </BottomNavigation>
    </Stack>
  );
};

export default Footer;
