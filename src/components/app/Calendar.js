import { useEffect, useState } from 'react';
import { differenceInDays, format, parseISO } from 'date-fns';
import { chunk, includes, padStart } from 'lodash';
// material
import { Box, Button, Stack, Typography } from '@mui/material';
// icon
import { Icon } from '@iconify/react';
import arrowIosBackOutline from '@iconify/icons-eva/arrow-ios-back-outline';
import arrowIosForwardOutline from '@iconify/icons-eva/arrow-ios-forward-outline';
// helpers
import {
  checkBookDate,
  createCalendarDate,
  getNewDate,
} from 'helpers/calendar';
// config
import { CALENDAR_HEAD, DAY_OF_WEEK_CODE } from 'config/constants';

const ButtonStyle = { minWidth: 78, height: 53, borderRadius: 2, p: 0 };
const EmptyButton = ({ text, sx = {}, disabled = false }) => {
  return (
    <Button
      fullWidth
      variant='outlined'
      color='tennis'
      sx={{
        ...ButtonStyle,
        cursor: 'default',
        borderColor: 'common.white',
        '&:hover': { borderColor: 'common.white' },
        '&.Mui-disabled': { borderColor: 'common.white' },
        ...sx,
      }}
      disabled={disabled}
    >
      {text}
    </Button>
  );
};
const DisabledButton = ({ date }) => {
  return (
    <Button
      fullWidth
      variant='outlined'
      color='tennis'
      disabled
      sx={{
        ...ButtonStyle,
        borderColor: 'tennis.main',
        fontSize: 16,
      }}
    >
      {date}
    </Button>
  );
};
const ButtonText = ({ date, text, color = 'common.black' }) => {
  return (
    <Stack spacing={0.3}>
      <Typography sx={{ color: color, fontSize: 16 }}>{date}</Typography>
      <Typography variant='caption' sx={{ color: color }}>
        {text}
      </Typography>
    </Stack>
  );
};
const CalendarDate = ({
  year,
  month,
  day,
  dates,
  booked,
  lesson,
  selected,
  handleClick,
}) => {
  return (
    <Stack direction={'row'} spacing={0.5}>
      {dates &&
        dates.map((date, index) => {
          if (date === 0) {
            return <EmptyButton disabled={true} key={index} />;
          }

          // It is the date before today. It is not lesson day.
          if (
            (lesson && DAY_OF_WEEK_CODE[lesson.lesson_day] !== index) ||
            (day && day > date)
          ) {
            return <DisabledButton date={date} key={index} />;
          }

          const dateText = `${year}-${month}-${padStart(date, 2, '0')}`;
          const info = {
            booked: 0,
            limit: Number(lesson.lesson_limit),
            booking: false,
          };
          if (booked && booked[dateText]) {
            info.booking = booked[dateText].book;
            info.booked = booked[dateText].booked;
          }

          // It is booked. It is fully booked.
          if (info.booking || info.booked === info.limit) {
            const color = info.booking ? 'common.black' : 'error.main';
            return (
              <Button
                fullWidth
                variant='contained'
                sx={{
                  ...ButtonStyle,
                  cursor: 'default',
                  borderColor: color,
                  backgroundColor: color,
                  '&:hover': {
                    borderColor: color,
                    backgroundColor: color,
                  },
                }}
                key={index}
              >
                <ButtonText
                  date={date}
                  text={info.booking ? '등록됨' : '예약완료'}
                  color='common.white'
                />
              </Button>
            );
          }

          const check = checkBookDate(dateText, lesson, booked);
          // It is able to book.
          const select = includes(selected, dateText);
          if (check) {
            const over90days =
              differenceInDays(parseISO(dateText), new Date()) > 90;
            const select = includes(selected, dateText);
            return (
              <Button
                fullWidth
                variant={select ? 'contained' : 'outlined'}
                color='tennis'
                sx={{
                  ...ButtonStyle,
                  borderColor: 'tennis.main',
                  cursor: over90days ? 'default' : 'pointer',
                }}
                onClick={over90days ? () => {} : () => handleClick(date)}
                disabled={over90days && !select}
                key={index}
              >
                <ButtonText date={date} text={`${info.booked}/${info.limit}`} />
              </Button>
            );
          }

          return (
            <Button
              fullWidth
              variant='outlined'
              sx={{
                ...ButtonStyle,
                cursor: 'default',
                borderColor: select && 'tennis.main',
                backgroundColor: select && 'tennis.main',
                '&:hover': {
                  borderColor: select && 'tennis.main',
                  backgroundColor: select && 'tennis.main',
                },
              }}
              disabled={select ? false : true}
              key={index}
            >
              <ButtonText
                date={date}
                text={select ? '' : '선택불가'}
                color={select ? 'common.black' : 'error.light'}
              />
            </Button>
          );
        })}
    </Stack>
  );
};
const Calendar = ({ lesson, selected, booked, handleDate }) => {
  // data
  const [calendar, setCalendar] = useState();
  const [today, setToday] = useState();
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [day, setDay] = useState();
  const [disablePrev, setDisablePrev] = useState(true);
  const [clickType, setClickType] = useState('today');

  useEffect(() => {
    const y = format(new Date(), 'yyyy');
    const m = format(new Date(), 'MM');
    const d = format(new Date(), 'dd');

    setToday({ year: y, month: m, day: d });
    setYear(y);
    setMonth(m);
    setDay(Number(d));
  }, []);

  useEffect(() => {
    if (year && month) {
      const dates = createCalendarDate(year, month);
      setCalendar(dates);
    }
    // eslint-disable-next-line
  }, [month]);

  const handleClick = (type) => {
    // If the type is today and the prev type is today, it will be blocked.
    if (clickType === type && type === 'today') return;
    setClickType(type);

    // clear calendar
    setCalendar();

    const { year: newYear, month: newMonth } = getNewDate(year, month, type);

    const y = newYear.toString();
    const m = padStart(newMonth, 2, '0');

    setYear(y);
    setMonth(m);

    // if the calendar date is the same as today, the day that is the default day is today.
    if (y === today.year && m === today.month) {
      setDay(Number(today.day));
      setDisablePrev(true);
    } else {
      setDay();
      setDisablePrev(false);
    }
  };
  const handleClickDate = (date) => {
    handleDate({ year, month, day: padStart(date, 2, '0') });
  };

  return (
    <Box sx={{ width: '100%', minHeight: 446 }}>
      <Stack direction={'row'} justifyContent='space-between'>
        <Stack direction={'row'} spacing={0.5}>
          <Button
            variant='outlined'
            color='tennis'
            sx={{ minWidth: 30, px: 1, borderRadius: 3 }}
            onClick={() => handleClick('prev')}
            disabled={disablePrev}
          >
            <Icon icon={arrowIosBackOutline} width='24' />
          </Button>
          <Button
            variant='outlined'
            color='tennis'
            sx={{ borderRadius: 3 }}
            onClick={() => handleClick('today')}
          >
            TODAY
          </Button>
          <Button
            variant='outlined'
            color='tennis'
            sx={{ minWidth: 30, px: 1, borderRadius: 3 }}
            onClick={() => handleClick('next')}
          >
            <Icon icon={arrowIosForwardOutline} width='24' />
          </Button>
        </Stack>
        <Typography variant='h3' sx={{ pt: 1 }}>
          {year}년 {month}월
        </Typography>
      </Stack>

      <Stack direction={'row'} spacing={0.5} sx={{ mt: 1 }}>
        {CALENDAR_HEAD.map((head, index) => {
          let color = '';
          if (index === 0) color = 'error.main';
          return (
            <EmptyButton
              text={head}
              sx={{ fontSize: 16, color: color }}
              key={index}
            />
          );
        })}
      </Stack>

      <Stack spacing={0.5} sx={{ pt: 1 }}>
        {calendar &&
          chunk(calendar, 7).map((dates, index) => (
            <CalendarDate
              year={year}
              month={month}
              day={day}
              dates={dates}
              selected={selected}
              booked={booked}
              lesson={lesson}
              handleClick={handleClickDate}
              key={index}
            />
          ))}
      </Stack>
    </Box>
  );
};

export default Calendar;
