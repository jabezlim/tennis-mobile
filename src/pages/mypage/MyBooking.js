import { forwardRef, useEffect, useState } from 'react';
import { concat } from 'lodash';
import {
  differenceInCalendarDays,
  differenceInMinutes,
  format,
  formatDistanceStrict,
  parseISO,
} from 'date-fns';
import { ko } from 'date-fns/locale';
// material
import { Stack, Typography } from '@mui/material';
// graphql
import { useLazyQuery } from '@apollo/client';
import { BOOKINGS_QUERY } from 'graphql/query';
// components
import { DialogContainer, GreyBox } from 'components/page';
// config
import { text12, text15B } from 'config/styles';
import { DATE_DAY_FORMAT } from 'config/constants';
// helpers
import { getAuthStore, getAuthUser } from 'helpers/storage';
// utils
import { fHmsToHm } from 'utils/formatDateTime';

const LIST_LIMIT = 20;
const MyBooking = forwardRef((_, ref) => {
  // data
  const [today] = useState(new Date());
  const [bookings, setBookings] = useState();
  const [totalPage, setTotalPage] = useState(0);
  const [totalRow, setTotalRow] = useState(0);
  const [open, setOpen] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // graphql
  const [getBookings, { fetchMore }] = useLazyQuery(BOOKINGS_QUERY, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    onCompleted: (data) => {
      if (data.clt_bookings) {
        if (currentPage === 1) {
          setBookings(data.clt_bookings.items);
        } else {
          setBookings(concat(bookings, data.clt_bookings.items));
        }

        if (totalPage !== data.clt_bookings.pageInfo.totalPage) {
          setTotalPage(data.clt_bookings.pageInfo.totalPage);
        }
        if (totalRow !== data.clt_bookings.pageInfo.totalRow) {
          setTotalRow(data.clt_bookings.pageInfo.totalRow);
        }
      }
    },
  });

  useEffect(() => {
    if (open) {
      setHasMore(totalPage > 0 && totalRow > currentPage * LIST_LIMIT);
    } else {
      setHasMore(false);
    }
  }, [totalPage, totalRow, currentPage, open]);

  // page open
  const handleOpen = (open) => {
    setOpen(open);
    if (open) {
      const variables = {
        memberId: getAuthUser().id,
        limit: LIST_LIMIT,
        offset: 0,
      };
      getBookings({ variables: variables });
    }
  };
  const handleScroll = () => {
    if (totalPage > 0 && totalRow > currentPage * LIST_LIMIT) {
      fetchMore({
        variables: { offset: currentPage * LIST_LIMIT },
      });
      setCurrentPage(currentPage + 1);
    }
  };

  // const handlePhone = (phone) => {
  //   window.location = 'tel:' + phone;
  // };

  return (
    <DialogContainer
      ref={ref}
      title='예약 관리'
      scroll={{
        start: currentPage - 1,
        loadMore: handleScroll,
        hasMore: hasMore,
      }}
      handleOpen={handleOpen}
    >
      <GreyBox sx={{ mt: -3 }}>
        <Stack spacing={2} sx={{ p: 2 }}>
          {bookings &&
            bookings.map((booking, index) => {
              const start = parseISO(
                `${booking.start_date} ${booking.start_time}`
              );
              const end = parseISO(`${booking.end_date} ${booking.end_time}`);
              const period = differenceInMinutes(end, start);
              const periodDays = differenceInCalendarDays(start, today);
              const date =
                periodDays > 0
                  ? format(start, DATE_DAY_FORMAT, { locale: ko })
                  : formatDistanceStrict(start, today, {
                      locale: ko,
                      addSuffix: true,
                    });
              return (
                <Stack
                  spacing={1}
                  sx={{ p: 2, bgcolor: 'common.white' }}
                  key={index}
                >
                  <Stack
                    direction={'row'}
                    justifyContent={'space-between'}
                    alignItems={'flex-end'}
                  >
                    <Typography sx={text15B}>{getAuthStore().name}</Typography>
                    <Typography
                      sx={{
                        ...text12,
                        color: periodDays === 0 ? 'error.main' : '',
                      }}
                    >
                      {date}
                    </Typography>
                  </Stack>
                  <Typography sx={text12}>
                    {`${fHmsToHm(booking.start_time)} - ${fHmsToHm(
                      booking.end_time
                    )} (${period}분)`}
                  </Typography>
                  <Typography sx={text12}>
                    {getAuthStore().site.address}
                  </Typography>
                  {/* <Box sx={{ borderBottom: '1px dashed #CECECE', pt: 2 }} />
                  <Stack direction={'row'} spacing={1} sx={{ pt: 1 }}>
                    <TButton
                      color='grey'
                      label='지점 전화'
                      sx={{ height: 40, fontWeight: 700 }}
                      onClick={() => handlePhone(getAuthStore().site.contact)}
                    />
                    <TButton
                      color='grey'
                      label='예약 취소'
                      sx={{
                        color: 'error.main',
                        height: 40,
                        fontWeight: 700,
                      }}
                    />
                  </Stack> */}
                </Stack>
              );
            })}
        </Stack>
      </GreyBox>
    </DialogContainer>
  );
});

export default MyBooking;
