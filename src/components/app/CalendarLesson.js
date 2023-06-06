import { useEffect, useState } from 'react';
import { chunk, includes } from 'lodash';
import { getDay } from 'date-fns';
// material
import { Stack, Typography } from '@mui/material';
// config
import { ChevronLeftIcon, ChevronRightIcon } from 'config/icons';
import { CALENDAR_HEAD, DAY_OF_WEEK_CODE } from 'config/constants';
import { text11, text12, text14B, text20B } from 'config/styles';
// helpers
import {
  checkBookDate,
  createCalendarDate,
  getNewDate,
} from 'helpers/calendar';

const CalendarLesson = ({ lesson, booked, selected, handleDate }) => {
  // data
  const [today, setToday] = useState();
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  // const [date, setDate] = useState();
  const [calendar, setCalendar] = useState();
  const [dayCode, setDayCode] = useState();
  const [limit, setLimit] = useState(1);
  const [period, setPeriod] = useState(1);

  useEffect(() => {
    const temp = new Date();
    const y = String(temp.getFullYear());
    const m = String(temp.getMonth() + 1).padStart(2, '0');
    const d = String(temp.getDate()).padStart(2, '0');
    const day = getDay(temp);

    setToday({ year: y, month: m, date: d, day: day });
    setYear(y);
    setMonth(m);
    // setDate(d);
  }, []);

  useEffect(() => {
    if (lesson) {
      setDayCode(DAY_OF_WEEK_CODE[lesson.lesson_day]);
      setLimit(Number(lesson.lesson_limit));
      setPeriod(Number(lesson.period));
    }
  }, [lesson]);

  useEffect(() => {
    if (year && month) {
      setCalendar(createCalendarDate(year, month));
    }
  }, [year, month]);

  const handleIconClick = (type) => {
    if (year === today.year && month === today.month && type === 'prev') return;

    const { year: newYear, month: newMonth } = getNewDate(year, month, type);
    const y = newYear.toString();
    // const m = padStart(newMonth, 2, '0');
    const m = newMonth.toString().padStart(2, '0');

    setYear(y);
    setMonth(m);
  };

  return (
    <Stack spacing={1}>
      <Stack direction={'row'} alignItems={'center'} spacing={1.5}>
        <ChevronLeftIcon
          color='grey'
          sx={{ width: 7.4, height: 12 }}
          onClick={() => handleIconClick('prev')}
        />
        <Typography sx={text20B}>{`${year}.${month}`}</Typography>
        <ChevronRightIcon
          color='grey'
          sx={{ width: 7.4, height: 12 }}
          onClick={() => handleIconClick('next')}
        />
      </Stack>
      <Stack spacing={0.5}>
        <Stack direction={'row'} spacing={0.5}>
          {[0, 1, 2, 3, 4, 5, 6].map((day) => {
            return (
              <Typography
                sx={{
                  ...text12,
                  width: dayCode === day ? '200%' : '100%',
                  height: 40,
                  lineHeight: '40px',
                  textAlign: 'center',
                  color:
                    day === 0 ? 'error.main' : day === 6 ? 'primary.main' : '',
                }}
                key={day}
              >
                {CALENDAR_HEAD[day]}
              </Typography>
            );
          })}
        </Stack>
        {calendar &&
          chunk(calendar, 7).map((dates, index) => {
            return (
              <CalendarDate
                today={today}
                year={year}
                month={month}
                dayCode={dayCode}
                dates={dates}
                limit={limit}
                period={period}
                booked={booked}
                selected={selected}
                onClick={handleDate}
                key={index}
              />
            );
          })}
      </Stack>
    </Stack>
  );
};

const CalendarDate = ({
  today,
  year,
  month,
  dayCode,
  dates,
  limit,
  period,
  booked,
  selected,
  onClick,
}) => {
  const handleClick = (date) => {
    if (onClick) onClick(date);
  };
  return (
    <Stack direction={'row'} spacing={0.5}>
      {dates.map((d, index) => {
        const dd = String(d).padStart(2, '0');
        const ymd = `${year}-${month}-${dd}`;
        const isSelected = includes(selected, ymd);
        const disabled = dayCode !== index;
        const pastDate =
          today.year === year && today.month === month && today.date > dd;

        const info = {
          booked: 0,
          limit: limit,
          booking: false,
        };
        if (booked && booked[ymd]) {
          info.booking = booked[ymd].booking;
          info.booked = booked[ymd].booked;
        }

        const enabled =
          !disabled &&
          !pastDate &&
          dd !== '00' &&
          !info.booking &&
          info.limit !== info.booked;
        const check = enabled ? checkBookDate(ymd, period, booked) : false;

        return (
          <Stack
            spacing={0.5}
            justifyContent={'center'}
            alignItems={'center'}
            sx={{
              width: disabled ? '100%' : '200%',
              height: 40,
              border: disabled || pastDate || dd === '00' ? 0 : 1,
              borderColor: info.booking
                ? 'error.main'
                : info.booked === info.limit ||
                  (!check && info.booked !== info.limit)
                ? 'tennis.200'
                : '',
              bgcolor:
                (!info.booking && info.booked === info.limit) ||
                (enabled && !check)
                  ? 'tennis.200'
                  : isSelected
                  ? 'tennis.dark'
                  : '',
            }}
            onClick={
              check
                ? () => handleClick({ year, month, date: dd, day: index })
                : () => {}
            }
            key={index}
          >
            <Typography
              sx={{
                ...text14B,
                color:
                  disabled || pastDate
                    ? 'grey.200'
                    : isSelected
                    ? 'common.white'
                    : '',
              }}
            >
              {dd === '00' ? '' : dd}
            </Typography>
            {!info.booking &&
              !disabled &&
              !pastDate &&
              dd !== '00' &&
              (!enabled || check) &&
              !isSelected && (
                <Typography sx={text11}>
                  {info.booked}/{info.limit}
                </Typography>
              )}
          </Stack>
        );
      })}
    </Stack>
  );
};

export default CalendarLesson;
