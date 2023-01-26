import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
// material
import { styled } from '@mui/material/styles';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
// graphql
import { useLazyQuery } from '@apollo/client';
import { BOOKINGS_QUERY } from 'graphql/query';
// components
import { MainCard } from 'components/ui/cards';
// helper
import { getAuthBarcode, getAuthUser, removeAuthData } from 'helpers/storage';
// config
import { path } from 'config/path';
import { BOOKING_TYPE, HOME_LIST } from 'config/constants';

const Booking = ({ booking }) => {
  return (
    <Stack spacing={1} sx={{ width: '100%' }}>
      <Typography variant='h4'>{booking.store_name}</Typography>
      <Typography variant='h5'>
        {BOOKING_TYPE[booking.type]} - {booking.machine_program_name}
      </Typography>
      <Typography>
        시작: {booking.start_date} {booking.start_time}
      </Typography>
      <Typography>
        완료: {booking.end_date} {booking.end_time}
      </Typography>
    </Stack>
  );
};

const StyledButton = styled(Button)({
  fontSize: 24,
  paddingTop: 15,
  paddingBottom: 15,
});
const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  // data
  const [bookings, setBookings] = useState();
  // graphql
  const [getBookings] = useLazyQuery(BOOKINGS_QUERY, {
    onCompleted: (data) => {
      if (data.clt_bookings) {
        setBookings(data.clt_bookings.items);
      }
    },
  });

  useEffect(() => {
    const variables = {
      memberId: getAuthUser().id,
      limit: 2,
      offset: 0,
      type: 'next',
    };
    getBookings({ variables: variables });
    // eslint-disable-next-line
  }, []);

  const handleClick = (url) => {
    navigate(url);
  };
  const handleLogout = async () => {
    removeAuthData();
    navigate(path.urls.login);
  };

  return (
    <MainCard>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {bookings && (
          <Typography variant='h3' sx={{ width: 100 }}>
            예약
          </Typography>
        )}
        {bookings &&
          bookings.map((booking, index) => (
            <Booking booking={booking} key={index} />
          ))}
      </Stack>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mt: 2 }}>
        <Box
          sx={{
            width: 220,
            textAlign: 'center',
            mx: 'none',
            [theme.breakpoints.down('md')]: {
              mx: 'auto',
            },
          }}
        >
          <Box
            sx={{
              width: 220,
              height: 220,
              p: 1,
              mt: 3,
              border: 1,
            }}
          >
            <QRCode
              value={getAuthBarcode()}
              style={{ height: '100%', maxWidth: '100%', width: '100%' }}
              viewBox={`0 0 256 256`}
            />
          </Box>
          <Typography variant='h3' sx={{ mt: 2 }}>
            {getAuthBarcode()}
          </Typography>
        </Box>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ py: { xs: 0, md: 2 } }}
        >
          {HOME_LIST &&
            HOME_LIST.map((list, index) => {
              if (list.path) {
                return (
                  <StyledButton
                    variant='contained'
                    color='tennis'
                    sx={{
                      borderRadius: 9,
                      color: 'common.black',
                      width: { xs: '100%', md: 180 },
                    }}
                    onClick={() => handleClick(list.path)}
                    key={index}
                  >
                    {list.label}
                  </StyledButton>
                );
              } else {
                return (
                  <StyledButton
                    variant='contained'
                    color='tennis'
                    sx={{
                      borderRadius: 9,
                      color: 'common.black',
                      width: '100%',
                    }}
                    onClick={handleLogout}
                    key={index}
                  >
                    {list.label}
                  </StyledButton>
                );
              }
            })}
        </Stack>
      </Stack>
    </MainCard>
  );
};

export default Home;
