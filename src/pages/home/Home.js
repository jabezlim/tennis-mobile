import { useEffect, useRef, useState } from 'react';
import { concat } from 'lodash';
import {
  differenceInMinutes,
  format,
  formatDistanceStrict,
  parseISO,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
// material
import { Box, Stack, Typography } from '@mui/material';
// graphql
import { useLazyQuery, useQuery } from '@apollo/client';
import { BOOKINGS_TYPE_QUERY, MEMBER_TIMES_QUERY } from 'graphql/query';
// components
import { GreyBox, PageContainer } from 'components/page';
import { IconTButton, TButton } from 'components/ui';
// config
import {
  text12,
  text14,
  text15B,
  text16B,
  text18,
  text18B,
  text40,
} from 'config/styles';
import { ChevronRightIcon } from 'config/icons';
import { path } from 'config/path';
import { DATE_FORMAT } from 'config/constants';
// helpers
import { getAuthBarcode, getAuthStore, getAuthUser } from 'helpers/storage';
// utils
import { fDateToDot, fHmsToHm } from 'utils/formatDateTime';
// pages
import CodeInfo from './CodeInfo';
import MyProfile from 'pages/mypage/MyProfile';
import MyPayment from 'pages/mypage/MyPayment';
import MyBooking from 'pages/mypage/MyBooking';

const LIST_LIMIT = 5;
const Home = () => {
  const navigate = useNavigate();
  const codeRef = useRef();
  const profileRef = useRef();
  const paymentRef = useRef();
  const bookingRef = useRef();
  // data
  const [today] = useState(new Date());
  const [date] = useState(format(new Date(), DATE_FORMAT));
  const [time, setTime] = useState(0);
  const [bookings, setBookings] = useState();
  const [totalPage, setTotalPage] = useState(0);
  const [totalRow, setTotalRow] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // graphql
  useQuery(MEMBER_TIMES_QUERY, {
    onCompleted: (data) => {
      if (data.clt_membertimes) {
        setTime(data.clt_membertimes.time - data.clt_membertimes.used_time);
      }
    },
  });
  const [getBookings, { fetchMore }] = useLazyQuery(BOOKINGS_TYPE_QUERY, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    onCompleted: (data) => {
      if (currentPage === 1) {
        setBookings(data.clt_bookings_type.items);
      } else {
        setBookings(concat(bookings, data.clt_bookings_type.items));
      }

      if (totalPage !== data.clt_bookings_type.pageInfo.totalPage) {
        setTotalPage(data.clt_bookings_type.pageInfo.totalPage);
      }
      if (totalRow !== data.clt_bookings_type.pageInfo.totalRow) {
        setTotalRow(data.clt_bookings_type.pageInfo.totalRow);
      }
    },
  });

  useEffect(() => {
    getBookings({
      variables: {
        memberId: getAuthUser().id,
        limit: LIST_LIMIT,
        offset: 0,
        type: 'next',
      },
    });
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    setHasMore(totalPage > 0 && totalRow > currentPage * LIST_LIMIT);
  }, [totalPage, totalRow, currentPage]);

  const handleNavigate = (path) => {
    if (path === 'code') codeRef.current.open();
    else if (path === 'profile') profileRef.current.open();
    else if (path === 'payment') paymentRef.current.open();
    else if (path === 'booking') bookingRef.current.open();
  };

  const handleMore = () => {
    if (totalPage > 0 && totalRow > currentPage * LIST_LIMIT) {
      fetchMore({
        variables: { offset: currentPage * LIST_LIMIT },
      });
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <PageContainer>
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          sx={{ height: 32, bgcolor: 'tennis.200', px: 2 }}
        >
          <Typography sx={text14}>예약자 코드</Typography>
          <Typography sx={text14}>{/* 플레이중 */}</Typography>
        </Stack>
        <GreyBox direction={'row'} spacing={2} sx={{ p: 2, mx: 0 }}>
          <Box
            sx={{ width: 88, height: 88, cursor: 'pointer' }}
            onClick={() => handleNavigate('code')}
          >
            <QRCode
              value={getAuthBarcode()}
              bgColor={'#E4F8EE'}
              style={{ height: '100%', maxWidth: '100%', width: '100%' }}
              viewBox={`0 0 256 256`}
            />
          </Box>
          <Stack spacing={1}>
            <Typography sx={text16B}>{getAuthUser().name}</Typography>
            <Typography sx={{ ...text12, color: 'text.grey' }}>
              {getAuthBarcode()}
            </Typography>
          </Stack>
        </GreyBox>
        {/* <Stack direction={'row'} spacing={1} sx={{ mt: 1 }}>
          <TButton
            label='예약자정보 수정'
            color='grey'
            onClick={() => handleNavigate('profile')}
          />
          <TButton label='지점 정보' color='grey' />
        </Stack> */}
        <GreyBox spacing={3} sx={{ mt: 3, px: 2, pt: 3, pb: 2 }}>
          <Stack spacing={1}>
            {/* <Stack direction={'row'} justifyContent={'space-between'}>
              <Typography sx={text16B}>잔여 이용권</Typography>
              <IconTButton
                label='내역 보기'
                color='grey'
                direction='row-reverse'
                icon={<ChevronRightIcon sx={{ width: 5.48, height: 9.42 }} />}
                sx={{ width: 96, backgroundColor: 'transparent' }}
                onClick={() => handleNavigate('payment')}
              />
            </Stack> */}
            <Stack spacing={3} sx={{ bgcolor: 'common.white', p: 2 }}>
              <Typography sx={text18B}>{getAuthStore().name}</Typography>
              <Stack direction={'row'} justifyContent={'right'} >
                {/* <Stack direction={'row'} spacing={0.5}>
                  <Typography sx={text40}>{time}</Typography>
                  <Typography sx={{ ...text18, pt: 2.1 }}>분</Typography>
                </Stack> */}
                <TButton
                  label='예약하기'
                  sx={{ width: 132, height: 40 }}
                  onClick={() => navigate(path.urls.booking)}
                />
              </Stack>
            </Stack>
          </Stack>
          <Stack spacing={1}>
            <Stack direction={'row'} justifyContent={'space-between'}>
              <Typography sx={text16B}>나의 예약 현황</Typography>
              <IconTButton
                label='예약 내역'
                color='grey'
                direction='row-reverse'
                icon={<ChevronRightIcon sx={{ width: 5.48, height: 9.42 }} />}
                sx={{ width: 96, backgroundColor: 'transparent' }}
                onClick={() => handleNavigate('booking')}
              />
            </Stack>
            <Stack spacing={1}>
              {bookings &&
                bookings.map((booking, index) => {
                  const start = parseISO(
                    `${booking.start_date} ${booking.start_time}`
                  );
                  const end = parseISO(
                    `${booking.end_date} ${booking.end_time}`
                  );
                  const period = differenceInMinutes(end, start);
                  const distance = formatDistanceStrict(start, today, {
                    locale: ko,
                    addSuffix: true,
                  });
                  return (
                    <Stack
                      direction={'row'}
                      justifyContent={'space-between'}
                      sx={{ bgcolor: 'common.white', p: 2 }}
                      key={index}
                    >
                      <Stack spacing={1}>
                        <Stack direction={'row'} spacing={0.5}>
                          <Typography sx={text15B}>
                            {booking.machine_program_name}
                          </Typography>
                          <Typography
                            sx={{ ...text12, color: 'grey.800', pt: 0.4 }}
                          >
                            {booking.type === 'lesson' ? '레슨' : '시설 이용'}
                          </Typography>
                        </Stack>

                        <Typography sx={text12}>
                          {`${fDateToDot(booking.start_date)} ${fHmsToHm(
                            booking.start_time
                          )} - ${fHmsToHm(booking.end_time)} (${period}분)`}
                        </Typography>
                      </Stack>
                      <Typography
                        sx={{
                          ...text12,
                          color:
                            date === booking.start_date ? 'error.main' : '',
                          pr: 1,
                        }}
                      >
                        {distance}
                      </Typography>
                    </Stack>
                  );
                })}
            </Stack>
            {hasMore && (
              <Typography
                sx={{ ...text12, textAlign: 'center', py: 1 }}
                onClick={handleMore}
              >
                더보기
              </Typography>
            )}
          </Stack>
        </GreyBox>
      </PageContainer>
      <CodeInfo ref={codeRef} />
      <MyProfile ref={profileRef} />
      <MyPayment ref={paymentRef} />
      <MyBooking ref={bookingRef} />
    </>
  );
};

export default Home;
