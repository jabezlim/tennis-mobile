import { forwardRef, useRef } from 'react';
// material
import { Divider, Stack, Typography } from '@mui/material';
// graphql
// import { useLazyQuery } from '@apollo/client';
// import { MEMBER_TIMES_QUERY } from 'graphql/query';
// components
import { DialogContainer, GreyBox } from 'components/page';
import { IconTButton, LogoutModal, TButton } from 'components/ui';
// helpers
import { getAuthUser } from 'helpers/storage';
// config
import { text12, text14, text15, text16 } from 'config/styles';
import {
  // ChevronRightIcon,
  CreditCardIcon,
  EventAvailableIcon,
  // FavoriteIcon,
  // GradeIcon,
  LogoutIcon,
  VideoIcon,
} from 'config/icons';
// pages
import MyPoint from './MyPoint';
import MyProfile from './MyProfile';
import MyBranch from './MyBranch';
import MyLesson from './MyLesson';
import MyBooking from './MyBooking';
import MyVideo from './MyVideo';
import MyPayment from './MyPayment';

const MyPage = forwardRef((_, ref) => {
  const profileRef = useRef();
  const pointRef = useRef();
  const branchRef = useRef();
  const lessonRef = useRef();
  const bookingRef = useRef();
  const videoRef = useRef();
  const paymentRef = useRef();
  const logoutRef = useRef();
  // data
  // const [point, setPoint] = useState(0);

  // graphql
  // For point
  // const [getMemberTimes] = useLazyQuery(MEMBER_TIMES_QUERY, {
  //   onCompleted: (data) => {
  //     if (data.clt_membertimes) {
  //       setPoint(data.clt_membertimes.time - data.clt_membertimes.used_time);
  //     }
  //   },
  // });

  // page open
  const handleOpen = (open) => {
    if (open) {
      // For point
      // getMemberTimes();
    }
  };

  const handleNavigate = (path) => {
    if (path === 'profile') profileRef.current.open();
    else if (path === 'point') pointRef.current.open();
    else if (path === 'branch') branchRef.current.open();
    else if (path === 'lesson') lessonRef.current.open();
    else if (path === 'booking') bookingRef.current.open();
    else if (path === 'video') videoRef.current.open();
    else if (path === 'payment') paymentRef.current.open();
    else if (path === 'logout') logoutRef.current.open();
  };

  return (
    <>
      <DialogContainer ref={ref} title='마이페이지' handleOpen={handleOpen}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Stack spacing={1}>
            <Stack direction={'row'} spacing={0.5}>
              <Typography sx={{ ...text16, fontWeight: 700 }}>
                {getAuthUser().name}
              </Typography>
              <Typography sx={text15}>님</Typography>
            </Stack>
            <Typography sx={text12}>{getAuthUser().contact}</Typography>
          </Stack>
          <TButton
            label='회원정보 수정'
            color='grey'
            onClick={() => handleNavigate('profile')}
            sx={{ width: 110, height: 28, ...text12 }}
          />
        </Stack>
        {/* <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            sx={{ height: 56, px: 2, mt: 2, bgcolor: 'grey.100' }}
          >
            <Typography sx={text14}>
              내 포인트
            </Typography>
            <Stack
              direction={'row'}
              spacing={0.5}
              alignItems={'center'}
              sx={{ cursor: 'pointer' }}
              onClick={() => handleNavigate('point')}
            >
              <Typography
                sx={{ fontSize: 24, lineHeight: '24px', fontWeight: 700 }}
              >
                {point}
              </Typography>
              <Typography
                sx={{
                  fontSize: 20,
                  lineHeight: '20px',
                  color: 'grey.1000',
                  pt: 0.3,
                  pr: 0.5,
                }}
              >
                P
              </Typography>
              <ChevronRightIcon
                color='grey'
                sx={{ width: 5.48, height: 9.42 }}
              />
            </Stack>
          </Stack> */}
        <Stack direction={'row'} spacing={1} sx={{ height: 56, mt: 2 }}>
          {/* <IconTButton
              label='내 지점'
              color='grey'
              icon={<GradeIcon />}
              onClick={() => handleNavigate('branch')}
            />
            <IconTButton
              label='찜한 레슨'
              color='grey'
              icon={<FavoriteIcon />}
              onClick={() => handleNavigate('lesson')}
            /> */}
          <IconTButton
            label='예약 관리'
            color='grey'
            icon={<EventAvailableIcon />}
            onClick={() => handleNavigate('booking')}
          />
          <IconTButton
            label='내 동영상'
            color='grey'
            icon={<VideoIcon />}
            onClick={() => handleNavigate('video')}
          />
        </Stack>
        <GreyBox sx={{ height: 8, mt: 3 }} />
        <Stack direction={'column'} spacing={0}>
          <IconTButton
            label='구매내역'
            color='white'
            direction='row'
            justifyContent='flex-start'
            icon={<CreditCardIcon color='grey' />}
            sx={{ height: 60 }}
            labelSX={text14}
            onClick={() => handleNavigate('payment')}
          />
          <Divider sx={{ borderColor: 'grey.200', mx: -2 }} />
          <IconTButton
            label='로그아웃'
            color='white'
            direction='row'
            justifyContent='flex-start'
            icon={<LogoutIcon color='grey' />}
            sx={{ height: 60 }}
            labelSX={text14}
            onClick={() => handleNavigate('logout')}
          />
          <Divider sx={{ borderColor: 'grey.200', mx: -2 }} />
        </Stack>
      </DialogContainer>
      {/* My Pages */}
      <MyProfile ref={profileRef} />
      <MyPoint ref={pointRef} />
      <MyBranch ref={branchRef} />
      <MyLesson ref={lessonRef} />
      <MyBooking ref={bookingRef} />
      <MyVideo ref={videoRef} />
      <MyPayment ref={paymentRef} />
      {/* Logout */}
      <LogoutModal ref={logoutRef} />
    </>
  );
});

export default MyPage;
