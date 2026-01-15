import { useEffect, useState } from 'react';
import { addDays, format, parseISO } from 'date-fns';
import { get, set, split } from 'lodash';
// material
import { Stack, Typography } from '@mui/material';
// config
import {
  CALENDAR_HEAD,
  DATETIME_FORMAT,
  DATE_FORMAT,
  DAY_OF_WEEK,
  NEXT_DATE_TIME_PERIOD,
} from 'config/constants';
import { text11, text12, text14, text14B } from 'config/styles';
import { fNumber } from 'utils/formatNumber';
import { cibase } from 'config/path';
import {
  createContinuousTime,
  //createMachineBlockedData,
  //createMachineData,
} from 'helpers/timeTable';
import { forEach } from 'lodash';
import { getAuthUser, getAuthStore } from 'helpers/storage';

const TimeTable = ({
  date,
  period = 15,
  blocked = {},
  discounts = {},
  booked = [],
  bookingTimes = [], 
  setBookingTimes,
  setPrice,
  machine,
  start_store_time = 0,
  end_store_time = 24,
}) => {
  // data
  const [nextDate, setNextDate] = useState();
  const [today, setToday] = useState();
  const [minutes, setMinutes] = useState([]);
  const [times, setTimes] = useState();
  const [isShowAM, setIsShowAM] = useState(true);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [holiday, setHoliday] = useState(false);
  const userType = getAuthUser().type;
  const storeData = getAuthStore();

  useEffect(() => {
    if (!today) {
      const dateHour = format(new Date(), DATETIME_FORMAT);
      const temp = split(dateHour, ' ');
      const tempTime = split(temp[1], ':');
      setToday({ date: temp[0], hour: tempTime[0], minute: tempTime[1] });

      const tempMinutes = [];
      for (let i = 0; i < 60 / period; i++) {
        // tempMinutes.push(padStart(i * period, 2, '0'));
        tempMinutes.push(String(i * period).padStart(2, '0'));
      }
      setMinutes(tempMinutes);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (bookingTimes.length > 0) {
      //console.log('bookingTimes changed : ', bookingTimes);
      //console.log('selectedTimes : ', selectedTimes);
      //console.log('times : ', times);

      let totalPriceTemp = 0;
      forEach(times, (time) => {
        Object.entries(time).forEach((time) => {
          const tempTime = `${time[1].hour}:00:00`;
          const tempDateTime = `${time[1].date} ${tempTime}`;            
          const isSelected = bookingTimes.includes(tempDateTime);
          if (isSelected) {
            totalPriceTemp += parseInt(time[1].price);
          }
        });
      });
      console.log('totalPriceTemp', totalPriceTemp);
      setPrice(totalPriceTemp);
    }
    // eslint-disable-next-line
  }, [bookingTimes]);

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

  function getTimecell(i, date, holiday=false) {
    const hour = String(i).padStart(2, '0')
    const tempTime = `${hour}:00:00`;
    const discnts = discounts[DAY_OF_WEEK[date.getDay()]] || {};
    const discount = holiday ? false : discnts[tempTime] || false;
    let price = machine ? machine.mprice : 3500;
    if (discount && price>1000) {
      price = Math.floor(price/1000 * (100-discount) / 100.0) * 1000;
    }
    if (userType == 2) {
      price = Math.floor(price * (100-storeData.discount) / 100.0); // 10% member discount
    }
    return {
      date: format(date, DATE_FORMAT),
      hour: hour,          
      day: DAY_OF_WEEK[date.getDay()],
      discount: discount,
      price : price,
    }
  }

  function handleTimeTable(date, is_holiday) {
    //console.log('user type : ', getAuthUser().type);
    const temp = { am: [], pm: [] }; 
    for (let i = start_store_time; i < 12; i++) {
      temp.am.push(getTimecell(i, date, is_holiday));
    }
    for (let i = start_store_time < 12 ? 12 : start_store_time; i < end_store_time; i++) {
      temp.pm.push(getTimecell(i, date, is_holiday));
    }
    setTimes(temp);
  }

  function isHoliday(date) {
    fetch(`${cibase}/schedule/isholiday/${format(date, DATE_FORMAT)}`)
      .then((response) => response.json())
      .then((data) => {
        //console.log('Success:', data);   
        handleTimeTable(date, data.is_holiday);     
        return data.is_holiday;
      })
      .catch((error) => {
        console.error('Error:', error);
        return false;
      });
  }

  useEffect(() => {
    if (date) {
      //console.log('today : ', today);
      //console.log('date : ', format(date, DATE_FORMAT));
      setHoliday(isHoliday(date));
      setSelectedTimes([]);
      setNextDate({
        date: format(addDays(date, 1), DATE_FORMAT),
        day: (date.getDay() + 1) % 7,
      });
      if (today) {
        if ((start_store_time>11) || (format(date, DATE_FORMAT) === today.date && Number(today.hour) > 11)) {
          setIsShowAM(false);
        } else {
          setIsShowAM(true);
        }
      }
    }
    // eslint-disable-next-line
  }, [date, today]);

  useEffect(() => {
    // if (nextDate) {
    //   const temp = { am: [], pm: [] }; //, next: [] };
    //   for (let i = start_store_time; i < 12; i++) {
    //     temp.am.push(getTimecell(i, date));
    //   }
    //   for (let i = start_store_time < 12 ? 12 : start_store_time; i < end_store_time; i++) {
    //     temp.pm.push(getTimecell(i, date));
    //   }
    //   setTimes(temp);
    // }
    // eslint-disable-next-line
  }, [nextDate, machine, discounts, holiday]);


  const handleTime = (time) => {
    if (selectedTimes.length === 1) {
      setSelectedTimes((prev) => [...prev, time]);
    } else {
      setSelectedTimes([time]);
    }
  };

  return (
    <Stack spacing={2}>
      {isShowAM && (
        <Stack spacing={1}>
          <Stack direction={'row'} alignItems={'flex-end'} spacing={0.5}>
            <Typography sx={text14B}>AM</Typography>
            <Typography sx={{ ...text12 }}>
              {date && `${format(date, DATE_FORMAT)} (${CALENDAR_HEAD[date.getDay()]})`}
            </Typography>
          </Stack>
          {times &&
            times.am.map((time, index) => (
              <TimeTableHour
                today={today}
                time={time}
                minutes={minutes}
                blocked={blocked[time.day]}
                discounts={discounts[time.day]}
                booked={booked}
                bookings={bookingTimes}
                onClick={handleTime}
                key={index}
              />
            ))}
        </Stack>
      )}
      <Stack spacing={1}>
        <Stack direction={'row'} alignItems={'flex-end'} spacing={0.5}>
          <Typography sx={text14B}>PM</Typography>
          <Typography sx={{ ...text12 }}>
            {date && `${format(date, DATE_FORMAT)} (${CALENDAR_HEAD[date.getDay()]})`}
          </Typography>
        </Stack>
        {times &&
          times.pm.map((time, index) => (
            <TimeTableHour
              today={today}
              time={time}
              minutes={minutes}
              blocked={blocked[time.day]}
              discounts={discounts[time.day]}
              booked={booked}
              bookings={bookingTimes}
              onClick={handleTime}
              key={index}
            />
          ))}
      </Stack>
    </Stack>
  );
};

const TimeTableHour = ({
  today,
  time,
  minutes,
  blocked = [],
  discounts = {},
  booked = [],
  bookings = [],
  onClick,
}) => {
  if (today && time) {
    if (today.date === time.date && today.hour > time.hour) return <></>;
    const isSameHour = today.date === time.date && today.hour === time.hour;
    const disableMinute = Number(today.minute) + 1;
    return (
      <Stack direction={'row'} spacing={1}>
        {minutes &&
          minutes.map((minute, index) => {
            const tempTime = `${time.hour}:${minute}:00`;
            const tempDateTime = `${time.date} ${tempTime}`;
            const disabled =
              (isSameHour && disableMinute > minute) ||
              blocked.includes(tempTime) ||
              booked.includes(tempDateTime);
            const isSelected = bookings.includes(tempDateTime);

            return (
              <Stack
                justifyContent={'center'}
                alignItems={'center'}
                spacing={0.3}
                sx={{
                  width: '100%',
                  height: 44,
                  border: 1,
                  borderColor: disabled
                    ? 'grey.100'
                    : time.discount
                    ? 'tennis.dark'
                    : '',
                  bgcolor: disabled
                    ? 'grey.100'
                    : isSelected
                    ? 'tennis.main'
                    : '',
                }}
                onClick={
                  disabled
                    ? () => {}
                    : () =>
                        onClick({
                          ...time,
                          minute,
                          discount: time.discount || 0,
                        })
                }
                key={index}
              >
                <Typography
                  sx={{
                    ...text14,
                    color: !disabled && isSelected ? 'common.white' : '',
                  }}
                >
                  {`${time.hour}:${minute}`} {time.price > 0 ? `( ${fNumber(time.price)} 원 )` : '---'}
                </Typography>
                {time.discount && !disabled && (
                  <Typography sx={{ ...text11, color: 'error.main' }}>
                    {`${time.discount}%`}
                  </Typography>
                )}
              </Stack>
            );
          })}
      </Stack>
    );
  }
  return <></>;
};

export default TimeTable;
