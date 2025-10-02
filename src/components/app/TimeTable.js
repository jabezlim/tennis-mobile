import { useEffect, useState } from 'react';
import { addDays, format, parseISO } from 'date-fns';
import { split } from 'lodash';
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

const TimeTable = ({
  date,
  period = 15,
  blocked = {},
  discounts = {},
  booked = [],
  bookings = [],
  handleTime,
  start_store_time = 0,
  end_store_time = 24,
}) => {
  // data
  const [nextDate, setNextDate] = useState();
  const [today, setToday] = useState();
  const [minutes, setMinutes] = useState([]);
  const [times, setTimes] = useState();
  const [isShowAM, setIsShowAM] = useState(true);

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
    if (date) {
      setNextDate({
        date: format(addDays(parseISO(date.date), 1), DATE_FORMAT),
        day: (date.day + 1) % 7,
      });
      if ((start_store_time>11) || (date.date === today.date && Number(today.hour) > 11)) {
        setIsShowAM(false);
      } else {
        setIsShowAM(true);
      }
    }
    // eslint-disable-next-line
  }, [date]);

  useEffect(() => {
    if (nextDate) {
      const temp = { am: [], pm: [], next: [] };
      for (let i = start_store_time; i < 12; i++) {
        // temp.am.push({ date: date.date, hour: padStart(i, 2, '0') });
        temp.am.push({
          date: date.date,
          hour: String(i).padStart(2, '0'),
          day: DAY_OF_WEEK[date.day],
        });
      }
      for (let i = start_store_time < 12 ? 12 : start_store_time; i < end_store_time; i++) {
        // temp.pm.push({ date: date.date, hour: padStart(i, 2, '0') });
        temp.pm.push({
          date: date.date,
          hour: String(i).padStart(2, '0'),
          day: DAY_OF_WEEK[date.day],
        });
      }
      if ((start_store_time == 0) && (NEXT_DATE_TIME_PERIOD > 0)) {
        for (let i = 0; i < NEXT_DATE_TIME_PERIOD; i++) {
          // temp.next.push({ date: nextDate.date, hour: padStart(i, 2, '0') });
          temp.next.push({
            date: nextDate.date,
            hour: String(i).padStart(2, '0'),
            day: DAY_OF_WEEK[nextDate.day],
          });
        }
      }
      setTimes(temp);
    }
    // eslint-disable-next-line
  }, [nextDate]);

  return (
    <Stack spacing={2}>
      {isShowAM && (
        <Stack spacing={1}>
          <Stack direction={'row'} alignItems={'flex-end'} spacing={0.5}>
            <Typography sx={text14B}>AM</Typography>
            <Typography sx={{ ...text12 }}>
              {date && `${date.date} (${CALENDAR_HEAD[date.day]})`}
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
                bookings={bookings}
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
            {date && `${date.date} (${CALENDAR_HEAD[date.day]})`}
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
              bookings={bookings}
              onClick={handleTime}
              key={index}
            />
          ))}
      </Stack>
      {(start_store_time == 0) && (NEXT_DATE_TIME_PERIOD > 0) && (
        <Stack spacing={1}>
          <Stack direction={'row'} alignItems={'flex-end'} spacing={0.5}>
            <Typography sx={text14B}>AM</Typography>
            <Typography sx={{ ...text12 }}>
              {nextDate && `${nextDate.date} (${CALENDAR_HEAD[nextDate.day]})`}
            </Typography>
          </Stack>
          {times &&
            times.next.map((time, index) => (
              <TimeTableHour
                today={today}
                time={time}
                minutes={minutes}
                blocked={blocked[time.day]}
                discounts={discounts[time.day]}
                booked={booked}
                bookings={bookings}
                onClick={handleTime}
                key={index}
              />
            ))}
        </Stack>
      )}
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
                    : discounts[tempTime]
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
                          discount: discounts[tempTime] || 0,
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
                  {`${time.hour}:${minute}`}
                </Typography>
                {discounts[tempTime] && !disabled && (
                  <Typography sx={{ ...text11, color: 'error.main' }}>
                    {`${discounts[tempTime]}%`}
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
