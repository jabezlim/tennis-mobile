import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { concat, forEach, includes } from 'lodash';
import {
  addMinutes,
  differenceInDays,
  differenceInMinutes,
  format,
  getDay,
  parseISO,
} from 'date-fns';
import { ko } from 'date-fns/locale';
// material
import { Stack, TextField, Typography, Button } from '@mui/material';
import { LoadingButton, LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
// graphql
import { useMutation, useReactiveVar } from '@apollo/client';
import { BOOK_QUERY } from 'graphql/mutation';
// component
import { Machine, TimeTable } from 'components/app';
import Scrollbar from 'components/ui/Scrollbar';
// config
import { path } from 'config/path';
import { DATE_FORMAT, DAY_OF_WEEK, TIME_FORMAT } from 'config/constants';
// helper
import { createBookedData, createContinuousTime } from 'helpers/timeTable';
import { getAuthBarcode, getAuthUser } from 'helpers/storage';
import { storeDataVar } from 'helpers/cache';
import RefundDialog from 'pages/ticket/RefundDialog';

const BookingForm = ({
  memberTime,
  discount,
  booked,
  lessons,
  isToday,
  handleDate,
  handleMessage,
}) => {
  const navigate = useNavigate();
  const storeData = useReactiveVar(storeDataVar);
  // data
  const [bookDate, setBookDate] = useState(new Date());
  const [bookedTimes, setBookedTimes] = useState({});
  const [lessonTimes, setLessonTimes] = useState({});
  const [bookingTimes, setBookingTimes] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [discountTime, setDiscountTime] = useState();
  const [dayOfWeek, setDayOfWeek] = useState();
  const [btnDisable, setBtnDisable] = useState(false);
  const [machineId, setMachineId] = useState();
  const today = new Date();
  const maxDate = new Date(today.setMonth(today.getMonth() + 3));
  const [openRefundDialog, setOpenRefundDialog] = useState(false);
  // graphql
  const [booking] = useMutation(BOOK_QUERY, {
    onCompleted: (data) => {
      if (data.clt_booking.status) {
        navigate(path.urls.bookings);
      } else {
        handleMessage(data.clt_booking.message);
      }
    },
    onError: (error) => console.log(error),
  });

  useEffect(() => {
    if (bookDate && discount) {
      const day = DAY_OF_WEEK[getDay(bookDate)];
      setDayOfWeek(day);
      if (discount[day]) setDiscountTime(discount[day]);
      else setDiscountTime();
    }
    setBookingTimes([]);
  }, [bookDate, discount]);

  useEffect(() => {
    if (booked) {
      setBookedTimes(createBookedData(booked, storeData.booking_time_period));
    }
  }, [booked]);

  useEffect(() => {
    if (selectedTimes) {
      if (selectedTimes.length === 2) {
        const times = createContinuousTime(
          selectedTimes,
          storeData.booking_time_period
        );
        setBookingTimes(times);
      }
    }
  }, [selectedTimes]);

  useEffect(() => {
    const selectedTime = bookingTimes.length * storeData.booking_time_period;
    setTotalTime(selectedTime);
    if (selectedTime > memberTime) {
      setBtnDisable(true);
      handleMessage('선택하신 예약 시간이 사용 가능 시간을 초과하였습니다.');
    } else {
      setBtnDisable(false);
    }
    // eslint-disable-next-line
  }, [bookingTimes]);

  const handleChangeMachine = (id) => {
    setBookingTimes([]);
    setMachineId(id);
    if (lessons && lessons[id]) {
      setLessonTimes(lessons[id]);
    } else setLessonTimes({});
  };
  const handleClickTime = (time) => {
    const datetime = format(bookDate, DATE_FORMAT) + ' ' + time;
    if (selectedTimes.length === 1) {
      setSelectedTimes(concat(selectedTimes, datetime));
    } else {
      setSelectedTimes([datetime]);
      setBookingTimes([time]);
    }
  };

  const handleClickDialog = () => {
    setOpenRefundDialog(true);
  };

  const handleClickBook = () => {
    let checkDuplicate = true;
    for (const time in bookedTimes[machineId]) {
      if (includes(bookingTimes, time)) {
        checkDuplicate = false;
        break;
      }
    }

    if (checkDuplicate) {
      let discountValue = 0;
      if (discountTime) {
        forEach(bookingTimes, (time) => {
          if (discountTime[time] > 0) {
            discountValue +=
              storeData.booking_time_period * (discountTime[time] / 100);
            // discountValue += Math.round(storeData.booking_time_period * (discountTime[time] / 100));
          }
        });
        discountValue = Math.round(discountValue);
      }

      // calculate date and time
      const startDateTime = parseISO(
        `${format(bookDate, DATE_FORMAT)} ${bookingTimes[0]}`
      );
      const endDateTime = addMinutes(
        parseISO(
          `${format(bookDate, DATE_FORMAT)} ${
            bookingTimes[bookingTimes.length - 1]
          }`
        ),
        storeData.booking_time_period
      );
      const endTime = format(endDateTime, TIME_FORMAT);
      const usedTime =
        differenceInMinutes(endDateTime, startDateTime) - discountValue;
      const period = differenceInDays(
        parseISO(`${format(bookDate, DATE_FORMAT)}`),
        parseISO(format(new Date(), DATE_FORMAT))
      );

      const variables = {
        storeId: storeData.id,
        machineId: machineId,
        memberId: getAuthUser().id,
        barcode: getAuthBarcode(),
        discount: discountValue,
        day: dayOfWeek,
        times: JSON.stringify(bookingTimes),
        startDate: format(startDateTime, DATE_FORMAT),
        startTime: bookingTimes[0],
        endDate: format(endDateTime, DATE_FORMAT),
        endTime: endTime,
        usedTime: usedTime,
        period: period,
      };
      booking({ variables });
    }
  };

  return (
    <Stack spacing={2}>
      <Stack direction='row' spacing={2}>
        {/* <Store required /> */}
        <Machine required handleMachine={handleChangeMachine} />
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={ko}>
          <DatePicker
            disableCloseOnSelect={false}
            cancelText=''
            okText=''
            views={['day']}
            label='예약일 *'
            mask='____-__-__'
            inputFormat={DATE_FORMAT}
            showToolbar={false}
            value={bookDate}
            minDate={new Date()}
            maxDate={maxDate}
            onChange={(newValue) => {
              setBookDate(newValue);
              if (handleDate) handleDate(newValue);
            }}
            renderInput={(params) => (
              <TextField fullWidth {...params} color='tennis' />
            )}
          />
        </LocalizationProvider>
      </Stack>

      <Scrollbar sx={{ height: 300 }}>
        <TimeTable
          discount={discountTime}
          booked={bookedTimes[machineId]}
          lessons={lessonTimes[dayOfWeek]}
          bookingTimes={bookingTimes}
          period={storeData.booking_time_period}
          isToday={isToday}
          handleClick={handleClickTime}
        />
      </Scrollbar>

      <LoadingButton
        fullWidth
        size='large'
        type='submit'
        color='tennis'
        variant='contained'
        // disabled={btnDisable || bookingTimes.length < 2}
        disabled={btnDisable || bookingTimes.length === 0}
        onClick={handleClickBook}
      >
        {totalTime > 0 && `${totalTime}분`} 예약하기
      </LoadingButton>
      <Stack direction='row' sx={{ mt: 4 }}>
        <Typography sx={{ fontSize: 16, pt: 1 }}>
          예약취소 및 환불규정
        </Typography>
        <Button
          variant='outlined'
          color='tennis'
          sx={{
            width: 110,
            height: 36,
            fontSize: 14,
            borderRadius: 4.5,
            pt: 1,
            ml: 1,
          }}
          onClick={handleClickDialog}
        >
          자세히 보기
        </Button>
      </Stack>
      <RefundDialog open={openRefundDialog} setOpen={setOpenRefundDialog} />
    </Stack>
  );
};

export default BookingForm;
