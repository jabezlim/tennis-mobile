import { forwardRef, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { forEach, union } from 'lodash';
import {
  addDays,
  addMinutes,
  differenceInDays,
  differenceInMinutes,
  format,
  getDay,
  parseISO,
} from 'date-fns';
// material
import {
  Box,
  Dialog,
  DialogContent,
  Slide,
  Stack,
  Typography,
} from '@mui/material';
// graphql
import {
  useLazyQuery,
  useMutation,
  useQuery,
  useReactiveVar,
} from '@apollo/client';
import { BOOK_QUERY } from 'graphql/mutation';
import {
  DISCOUNT_SCHEDULE_QUERY,
  MACHINE_BLOCKED_QUERY,
  MACHINE_BOOKED_QUERY,
  MEMBER_TIMES_QUERY,
} from 'graphql/query';
// components
import { Calendar, Machine, TimeTable } from 'components/app';
import { GreyBox, PageContainer } from 'components/page';
import { AlertModal, TButton } from 'components/ui';
// config
import {
  text11,
  text11B,
  text12,
  text12B,
  text14,
  text14B,
  text15B,
  text16B,
  text18B,
} from 'config/styles';
import {
  DATETIME_FORMAT,
  DATE_FORMAT,
  DAY_OF_WEEK,
  DAY_OF_WEEK_KO,
  NEXT_DATE_TIME_PERIOD,
  TIME_FORMAT_AM_PM,
  PERIOD_TYPE,
} from 'config/constants';
import { CloseIcon } from 'config/icons';
import { path } from 'config/path';
// helpers
import { storeDataVar } from 'helpers/cache';
import {
  createContinuousTime,
  createMachineBlockedData,
  createMachineData,
} from 'helpers/timeTable';
import { getAuthBarcode, getAuthUser } from 'helpers/storage';
import Payment from 'pages/ticket/Payment';

const Booking = () => {
  const navigate = useNavigate();
  const storeData = useReactiveVar(storeDataVar);
  const paymentRef = useRef();
  // data
  const [date, setDate] = useState();
  const [period] = useState(storeData.booking_time_period);
  const [machine, setMachine] = useState();
  const [memberTime, setMemberTime] = useState(0);
  const [booking, setBooking] = useState();
  const [totalTime, setTotalTime] = useState(0);
  const [blocked, setBlocked] = useState();
  const [blockList, setBlockList] = useState();
  const [discount, setDiscount] = useState();
  const [booked, setBooked] = useState();
  const [bookList, setBookList] = useState();
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [bookingTimes, setBookingTimes] = useState([]);
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [message, setMessage] = useState();
  const [item, setItem] = useState();
  const [price, setPrice] = useState(3500);
  // graphql
  const [payment] = useMutation(BOOK_QUERY, {
    onCompleted: (data) => {
      if (data.clt_booking.status) {
        navigate(path.urls.home);
      } else {
        setMessage(data.clt_booking.message);
        setOpenAlert(true);
      }
    },
    onError: (error) => console.log(error),
  });

  useQuery(MEMBER_TIMES_QUERY, {
    onCompleted: (data) => {
      if (data.clt_membertimes) {
        const time = data.clt_membertimes.time - data.clt_membertimes.used_time;
        setMemberTime(time);
      }
    },
  });
  useQuery(MACHINE_BLOCKED_QUERY, {
    variables: { storeId: storeData.id },
    onCompleted: (data) => {
      if (data.clt_machineblocked && data.clt_machineblocked.length > 0) {
        const blocked = createMachineBlockedData(data.clt_machineblocked);
        setBlockList(blocked);
      }
    },
  });
  useQuery(DISCOUNT_SCHEDULE_QUERY, {
    variables: { storeId: storeData.id },
    onCompleted: (data) => {
      if (data.clt_discountschedule) {
        const dayOfWeek = {};
        forEach(data.clt_discountschedule, (d) => {
          if (!dayOfWeek[d.day]) dayOfWeek[d.day] = {};
          dayOfWeek[d.day][d.time] = d.discount;
        });
        setDiscount(dayOfWeek);
      }
    },
  });
  const [getMachineBooked] = useLazyQuery(MACHINE_BOOKED_QUERY, {
    onCompleted: (data) => {
      if (data.clt_machinebooked) {
        const booked = createMachineData(data.clt_machinebooked, 'machine_id');
        const temp = {};
        forEach(booked, (books, machine) => {
          temp[machine] = [];
          forEach(books, (book) => {
            const dates = createDate(
              `${book.start_date} ${book.start_time}`,
              `${book.end_date} ${book.end_time}`
            );
            temp[machine] = union(temp[machine], dates);
          });
        });
        setBookList(temp);
      }
    },
    onError: () => {
      setMessage('오류가 발생했습니다. 잠시 후에 다시 사용해 주세요.');
      setOpenAlert(true);
    },
  });
  const createDate = (start, end) => {
    const startDateTime = parseISO(start);
    const endDateTime = parseISO(end);
    const rows = differenceInMinutes(endDateTime, startDateTime) / period;

    const bookings = [];
    for (let i = 0; i < rows; i++) {
      const time = format(
        addMinutes(startDateTime, i * period),
        DATETIME_FORMAT
      );
      bookings.push(time);
    }
    return bookings;
  };

  useEffect(() => {
    //console.log(storeData);
    if (machine && blockList) {
      setBlocked(blockList[machine.id]);
    }
  }, [machine, blockList]);
  useEffect(() => {
    if (machine && bookList) {
      setBooked(bookList[machine.id]);
    }
  }, [machine, bookList]);

  useEffect(() => {
    if (selectedTimes) {
      if (selectedTimes.length === 2) {
        const times = [
          `${selectedTimes[0].date} ${selectedTimes[0].hour}:${selectedTimes[0].minute}`,
          `${selectedTimes[1].date} ${selectedTimes[1].hour}:${selectedTimes[1].minute}`,
        ];
        const temp = createContinuousTime(times, period);
        setBookingTimes(temp);
      } else if (selectedTimes.length === 1) {
        setBookingTimes([
          `${selectedTimes[0].date} ${selectedTimes[0].hour}:${selectedTimes[0].minute}:00`,
        ]);
      }
    }
    // eslint-disable-next-line
  }, [selectedTimes]);

  useEffect(() => {
    if (bookingTimes.length > 0) {
      const selectedTime = bookingTimes.length * period;
      //if (selectedTime > memberTime) {
      //  setMessage('선택하신 예약 시간이 사용 가능 시간을 초과하였습니다.');
      //  setOpenAlert(true);
      //  setTotalTime(0);
      //} else 
      setTotalTime(selectedTime);
      console.log('selectedTime', selectedTime);
      setItem(
        { 
          id: 170, 
          name : machine ? machine.name : '코트이용권',
          period: selectedTime / 60, 
          period_type: 2, 
          price : selectedTime / 60 * price,
          category_id: 3,
          menu_type: 1,
        }
      );
    }
    // eslint-disable-next-line
  }, [bookingTimes]);

  const initBookings = () => {
    setSelectedTimes([]);
    setBookingTimes([]);
    setItem();
  };
  const handleSelectDate = (date) => {
    initBookings();
    const d = `${date.year}-${date.month}-${date.date}`;
    setDate({ date: d, day: date.day });

    const variables = {
      storeId: storeData.id,
      date: d,
    };
    if (NEXT_DATE_TIME_PERIOD > 0) {
      const nextDate = format(addDays(parseISO(d), 1), DATE_FORMAT);
      variables.nextDate = nextDate;
      variables.nextTime = `${String(NEXT_DATE_TIME_PERIOD).padStart(
        2,
        '0'
      )}:00:00`;
    }
    getMachineBooked({ variables });
  };
  const handleChangeMachine = (id, name, machine_no) => {
    const mprice = machine_no == '' ? 3500 : Number(machine_no);
    setMachine({ id, name, mprice });
    setPrice( mprice );
    initBookings();
  };
  const handleTime = (time) => {
    if (selectedTimes.length === 1) {
      setSelectedTimes((prev) => [...prev, time]);
    } else {
      setSelectedTimes([time]);
    }
  };
  const handleBooking = () => {
    let checkDuplicate = true;
    if (booked) {
      for (const datetime of bookingTimes) {
        if (booked.includes(datetime)) {
          checkDuplicate = false;
          break;
        }
      }
    }
    if (checkDuplicate && blocked) {
      for (const datetime of bookingTimes) {
        const time = datetime.split(' ')[1];
        const day = handleDay(datetime);
        const blocks = blocked[day] || [];
        if (blocks.includes(time)) {
          checkDuplicate = false;
          break;
        }
      }
    }
    if (checkDuplicate) {
      let discountValue = 0;
      for (const datetime of bookingTimes) {
        const time = datetime.split(' ')[1];
        const day = handleDay(datetime);
        const discounts = discount[day] || [];

        if (discounts[time] > 0) {
          discountValue += period * (discounts[time] / 100);
        }
      }

      if (discountValue > 0) discountValue = Math.round(discountValue);

      const temp = {
        time: { total: totalTime, discount: discountValue, member: memberTime },
        machine: machine,
        bookings: bookingTimes,
      };
      console.log('booking:', temp);
      setBooking(temp);
      setOpen(true);
      // setSelectedTimes([]);
    } else {
      setMessage('예약 시간을 확인해 주세요.');
      setOpenAlert(true);
    }
  };
  const handleDay = (datetime) => {
    const dt = parseISO(datetime);
    return DAY_OF_WEEK[getDay(dt)];
  };

  const handlePayment = () => {
    const times = [];
    const today = parseISO(format(new Date(), DATE_FORMAT));
    for (const time of bookingTimes) {
      const temp = parseISO(time.substring(0, 10));
      const dayPeriod = differenceInDays(temp, today);
      times.push({
        time: time,
        day: DAY_OF_WEEK[getDay(temp)],
        period: dayPeriod,
      });
    }

    const startDateTime = bookingTimes[0].split(' ');
    const endDateTime = format(
      addMinutes(parseISO(bookingTimes[bookingTimes.length - 1]), period),
      DATETIME_FORMAT
    ).split(' ');
    const variables = {
      storeId: storeData.id,
      machineId: machine.id,
      memberId: getAuthUser().id,
      barcode: getAuthBarcode(),
      discount: booking.time.discount,
      times: JSON.stringify(times),
      startDate: startDateTime[0],
      startTime: startDateTime[1],
      endDate: endDateTime[0],
      endTime: endDateTime[1],
      usedTime: booking.time.total - booking.time.discount,
    };
    /*if (booking.time.member >= (booking.time.total - booking.time.discount)) {
      payment({ variables });
    } else {*/
      setItem({
        ...item,
        storeId: storeData.id,
        machineId: machine.id,
        memberId: getAuthUser().id,
        barcode: getAuthBarcode(),
        discount: booking.time.discount,
        times: JSON.stringify(times),
        startDate: startDateTime[0],
        startTime: startDateTime[1],
        endDate: endDateTime[0],
        endTime: endDateTime[1],
        usedTime: booking.time.total - booking.time.discount,
      })
      paymentRef.current.open()
    //}
  };

  const handleNavigate = (path) => {
    if (path === 'payment') paymentRef.current.open();
  };

  return (
    <PageContainer label='예약하기'>
      <Stack spacing={2}>
        <Typography sx={text15B}>코트 선택</Typography>
        {/* { storeData.id == 14 && (
        <Box
          component="img"
          src={`${path.basename}/images/courtlayout.png`}
          sx={{ width: '100%', height: 'auto' }}
        />  )} */}
        <Machine required handleMachine={handleChangeMachine} />
      </Stack>
      <Box
        sx={{ borderBottom: 1, borderColor: 'grey.200', mx: -2, mt: 1, mb: 3 }}
      />
      <Calendar handleDate={handleSelectDate} />
      <Box sx={{ bgcolor: 'grey.200', height: 8, mx: -2, my: 3 }} />
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Stack spacing={0.75}>
          <Typography sx={text15B}>이용시간</Typography>
          {/* <Typography sx={{ ...text11, color: 'grey.800' }}>
            6시간 이상은 지점에 문의
          </Typography> */}
        </Stack>
        <Stack direction={'row'} spacing={1}>
          <Stack direction={'row'} spacing={0.5}>
            <Box sx={{ width: 8, height: 8, border: 1, mt: 0.1 }} />
            <Typography sx={text11}>예약가능</Typography>
          </Stack>
          <Stack direction={'row'} spacing={0.5}>
            <Box sx={{ width: 8, height: 8, bgcolor: 'grey.200', mt: 0.1 }} />
            <Typography sx={text11}>예약불가</Typography>
          </Stack>
          {/* <Stack direction={'row'} spacing={0.5}>
            <Box
              sx={{
                width: 8,
                height: 8,
                border: 1,
                borderColor: 'error.main',
                mt: 0.1,
              }}
            />
            <Typography sx={text11}>할인</Typography>
          </Stack> */}
        </Stack>
      </Stack>
      {/* { memberTime > 0 && (
      <Stack direction={'row'} spacing={0.3} sx={{ mt: 3, mb: 2 }}>
        <Typography sx={{ ...text14, fontWeight: 500 }}>
          잔여 이용권:
        </Typography>
        <Typography sx={text14B}>{memberTime}분</Typography>
      </Stack>
      )} */}
      <TimeTable
        date={date}
        period={period}
        blocked={blocked}
        discounts={discount}
        booked={booked}
        bookings={bookingTimes}
        handleTime={handleTime}
        start_store_time={storeData.store_open}
        end_store_time={storeData.store_close}
      />
      <Box sx={{ height: 149 }} />
      { bookingTimes.length > 0 && (
        <BookingModal
          times={bookingTimes}
          totalTime={totalTime}
          period={period}
          onClick={handleBooking}
        />
      )}
      {/* {item && (
        <TicketModal item={item} onClick={() => handleNavigate('payment')} />
      )} */}
      <BookingDialog
        open={open}
        setOpen={setOpen}
        period={period}
        booking={booking}
        onClick={handlePayment}
      />
      <AlertModal
        error
        open={openAlert}
        alert={message}
        align='center'
        onClick={() => setOpenAlert(false)}
      />
      <Payment ref={paymentRef} item={item} />
    </PageContainer>
  );
};

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});
const BookingDialog = ({
  open,
  setOpen,
  period = 15,
  booking = {},
  onClick,
}) => {
  const start =
    booking.bookings && booking.bookings[0] && parseISO(booking.bookings[0]);
  const end =
    booking.bookings &&
    booking.bookings.length > 0 &&
    addMinutes(parseISO(booking.bookings[booking.bookings.length - 1]), period);

  return (
    <Dialog
      fullScreen
      open={open}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          position: 'absolute',
          top: 'calc(150% - 300px)',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        },
      }}
    >
      <DialogContent sx={{ p: 2 }}>
        <CloseIcon
          sx={{ position: 'absolute', top: 24, right: 21 }}
          onClick={() => setOpen(false)}
        />
        <Typography sx={{ ...text16B, textAlign: 'center', pt: 1, pb: 2.5 }}>
          예약하기
        </Typography>
        <Stack spacing={2} sx={{ p: 2, bgcolor: 'grey.100' }}>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Typography sx={{ ...text12, color: 'grey.800' }}>
              {start &&
                `${format(start, DATE_FORMAT)} (${
                  DAY_OF_WEEK_KO[DAY_OF_WEEK[getDay(start)]]
                })`}
            </Typography>
            <Typography sx={{ ...text12, color: 'grey.800' }}>
              {booking.machine && booking.machine.name}
            </Typography>
          </Stack>
          <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            sx={{ pb: 1 }}
          >
            <Typography sx={text14B}>
              {start && format(start, TIME_FORMAT_AM_PM)}
            </Typography>
            <Box sx={{ width: 44, borderTop: '1px dashed #CECECE' }} />
            <Typography
              sx={{
                ...text12B,
                width: 56,
                height: 24,
                lineHeight: '24px',
                textAlign: 'center',
                bgcolor: 'common.white',
              }}
            >
              {booking.time && booking.time.total / 60} 시간
            </Typography>
            <Box sx={{ width: 44, borderTop: '1px dashed #CECECE' }} />
            <Typography sx={text14B}>
              {end && format(end, TIME_FORMAT_AM_PM)}
            </Typography>
          </Stack>
        </Stack>
        { /* booking.time && ((booking.time.member >= (booking.time.total - booking.time.discount)) && (
          <>
            <Stack spacing={1} sx={{ mt: 1.5 }}>
              <Stack
                direction={'row'}
                alignItems={'flex-end'}
                justifyContent={'space-between'}
              >
                <Typography sx={text14B}>시설 이용권 사용</Typography>
                <Typography sx={text18B}>
                  {booking.time && booking.time.total - booking.time.discount}분
                  차감
                </Typography>
              </Stack>
            </Stack>
            <Typography
              sx={{
                ...text11,
                color: 'error.main',
                textAlign: 'right',
                my: 0.5,
              }}
            >
              차감 후 잔여 시간{' '}
              {booking.time &&
                booking.time.member - (booking.time.total - booking.time.discount)}
              분
            </Typography>
          </>
        )  */}
         { booking.machine && ( 
          <>
            <Stack spacing={1} sx={{ mt: 1.5 }}>
              <Stack
                direction={'row'}
                alignItems={'flex-end'}
                justifyContent={'space-between'}
              >
                <Typography sx={text14B}>결제금액</Typography>
                <Typography sx={text18B}>                      
                  { booking.machine.mprice * ((booking.time.total - booking.time.discount) / 60) } 원
                  &nbsp;( {(booking.time.total - booking.time.discount)  / 60 } 시간 )         
                </Typography>
              </Stack>
            </Stack>
            <Stack direction={'row'} spacing={0.3} sx={{ mt: 3, mb: 2 }}>
              <Typography sx={{ ...text11B, color: 'grey.800' }}>
                *취소 및 환불 규정:
              </Typography>
              <Typography sx={{ ...text11, color: 'grey.800' }}>
                예약 시작 기준 6시간 전 - 전액 환불
              </Typography>
            </Stack>
          </>
        )}
        <TButton label='결제하기' onClick={onClick} />
      </DialogContent>
    </Dialog>
  );
};

const BookingModal = ({ times = [], period = 15, totalTime = 0, onClick }) => {
  const start = times[0] && parseISO(times[0]);
  const end =
    times.length > 0 && addMinutes(parseISO(times[times.length - 1]), period);
  return (
    <GreyBox
      spacing={2}
      sx={{
        position: 'fixed',
        bottom: 56,
        left: 0,
        right: 0,
        p: 2,
        mx: 0,
        minHeight: 125,
      }}
    >
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Stack spacing={0.5}>
          <Typography sx={text11}>날짜</Typography>
          <Typography sx={text14B}>
            {start &&
              `${format(start, DATE_FORMAT)} ${
                DAY_OF_WEEK_KO[DAY_OF_WEEK[getDay(start)]]
              }`}
          </Typography>
        </Stack>
        <Stack spacing={0.5} alignItems={'flex-end'}>
          <Typography sx={text11}>시간</Typography>
          <Typography sx={text14B}>
            {start && `${format(start, TIME_FORMAT_AM_PM)}`}
            {end && ` - ${format(end, TIME_FORMAT_AM_PM)}`}
          </Typography>
        </Stack>
      </Stack>
      <TButton
        label='예약하기'
        disabled={times.length === 0 || totalTime === 0}
        onClick={onClick}
      />
    </GreyBox>
  );
};

const TicketModal = ({ item, onClick }) => {
  return (
    <Stack
      spacing={2}
      sx={{
        position: 'fixed',
        bottom: 56,
        left: 0,
        right: 0,
        p: 2,
        bgcolor: 'grey.100',
      }}
    >
      <Typography sx={{ ...text14, textAlign: 'center' }}>
        {item.period}
        {PERIOD_TYPE[item.period_type]} {item.price}원
      </Typography>
      <TButton label='구매 하기' onClick={onClick} />
    </Stack>
  );
};

export default Booking;
