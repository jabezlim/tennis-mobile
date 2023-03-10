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
import { HOME_LIST } from 'config/constants';

const Booking = ({ booking }) => {
  return (
    <Stack
      spacing={1}
      sx={{ width: '100%' }}
      direction='row'
      justifyContent='space-between'
    >
      <Typography variant='h3'>{booking.machine_program_name}</Typography>
      <Typography variant='h4'>
        {booking.start_date} {booking.start_time.substring(0, 5)} ~{' '}
        {booking.end_time.substring(0, 5)}
      </Typography>
    </Stack>
  );
};

const StyledButton = styled(Button)({
  fontSize: 25,
  paddingLeft: 40,
  paddingTop: 15,
  paddingBottom: 15,
  // "*:nth-of-type(1)": {
  //   fontSize: 41
  // }
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
      </Stack>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{ px: 2, mt: 2 }}
      >
        {bookings && bookings.length > 0 && (
          <>
            <Typography variant='h5' sx={{ width: 100 }}>
              예약 {bookings.length} 건
            </Typography>
            <Booking booking={bookings[0]} key={0} />
          </>
        )}
        {/* {bookings &&
          bookings.map((booking, index) => (
            <Booking booking={booking} key={index} />
          ))} */}
      </Stack>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mt: 2 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent='center'
          alignItems='center'
          spacing={2}
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
                      width: { xs: '75%', md: 250 },
                    }}
                    onClick={() => handleClick(list.path)}
                    key={index}
                    startIcon={list.icon}
                    fullWidth={true}
                    style={{ justifyContent: 'flex-start' }}
                  >
                    &nbsp;{list.label}
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
