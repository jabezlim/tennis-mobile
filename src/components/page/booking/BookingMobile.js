import { useEffect, useState } from 'react';
import { differenceInDays, format, getDay, parseISO } from 'date-fns';
import InfiniteScroll from 'react-infinite-scroller';
// material
import { Box, Divider, Stack, Typography } from '@mui/material';
// util
import { fDateIE, fTimeSuffix } from 'utils/formatDateTime';
// config
import {
  BOOKING_TYPE,
  DATE_FORMAT,
  DAY_OF_WEEK,
  DAY_OF_WEEK_KO,
} from 'config/constants';

const BookingMobile = ({ data, currentPage, handleCancel, handleScroll }) => {
  // data
  const [bookings, setBookings] = useState();
  const [today] = useState(parseISO(format(new Date(), DATE_FORMAT)));

  useEffect(() => {
    if (data) {
      setBookings(data);
    }
  }, [data]);

  return (
    <InfiniteScroll
      pageStart={currentPage - 1}
      loadMore={handleScroll}
      hasMore={true || false}
      initialLoad={false}
    >
      <Stack spacing={2}>
        {bookings && bookings.length === 0 && (
          <Typography variant='h4'>예약이 없습니다.</Typography>
        )}
        {bookings &&
          bookings.map((booking, index) => {
            const date = parseISO(booking.start_date);
            const day = DAY_OF_WEEK[getDay(date)];
            const period = differenceInDays(date, today);
            let color = 'inherit';
            if (period === 0) color = 'success.dark';
            else if (period > 0) color = 'primary.dark';
            // const cancel = differenceInMinutes(
            //   parseISO(`${booking.start_date} ${booking.start_time}`),
            //   new Date()
            // );

            return (
              <Box key={index}>
                <Stack spacing={1}>
                  <Stack direction={'row'} justifyContent='space-between'>
                    <Typography variant='h4'>{booking.store_name}</Typography>
                    <Typography variant='h5'>
                      {fDateIE(booking.created)}
                    </Typography>
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <Stack
                      direction={'row'}
                      spacing={1}
                      sx={{ width: { xs: 160 } }}
                    >
                      <Typography variant='body1' sx={{ color }}>
                        {booking.start_date}
                      </Typography>
                      <Typography variant='body1' sx={{ color }}>
                        {DAY_OF_WEEK_KO[day]}
                      </Typography>
                    </Stack>
                    <Stack
                      direction={'row'}
                      justifyContent='space-between'
                      sx={{ width: '100%' }}
                    >
                      <Stack direction={'row'} spacing={1}>
                        <Typography variant='body1'>
                          {fTimeSuffix(
                            `${booking.start_date} ${booking.start_time}`
                          )}
                        </Typography>
                        <Typography variant='body1'>-</Typography>
                        <Typography variant='body1'>
                          {fTimeSuffix(
                            `${booking.end_date} ${booking.end_time}`
                          )}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                  <Stack
                    direction={'row'}
                    justifyContent='space-between'
                    sx={{ width: '100%' }}
                  >
                    <Stack direction={'row'} spacing={1}>
                      <Typography variant='body1'>
                        {BOOKING_TYPE[booking.type]}
                      </Typography>
                      <Typography variant='body1'>
                        ({booking.machine_program_name})
                      </Typography>
                    </Stack>
                    {/* {cancel >= 60 && (
                        <Button
                          variant='outlined'
                          size='small'
                          color='error'
                          sx={{ mt: -0.9 }}
                          onClick={() => handleCancel(booking.id)}
                        >
                          예약취소
                        </Button>
                      )} */}
                  </Stack>
                </Stack>
                <Divider />
              </Box>
            );
          })}
      </Stack>
    </InfiniteScroll>
  );
};

export default BookingMobile;
