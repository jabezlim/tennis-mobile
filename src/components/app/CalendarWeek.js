import { useEffect, useState } from 'react';
import { getDay, parseISO } from 'date-fns';
// material
import { Stack, Typography } from '@mui/material';
// config
import { CALENDAR_HEAD } from 'config/constants';
import { text12, text14B } from 'config/styles';

const CalendarWeek = ({ ymd, selected, handleCalendar }) => {
  // data
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  // const [date, setDate] = useState();
  const [dates, setDates] = useState();

  useEffect(() => {
    const temp = (ymd && parseISO(ymd)) || new Date();
    const y = String(temp.getFullYear());
    const m = String(temp.getMonth() + 1).padStart(2, '0');
    // const d = String(temp.getDate()).padStart(2, '0');

    setYear(y);
    setMonth(m);
    // setDate(d);

    setDates(createWeekCalendarDate(temp, temp.getDate()));
  }, [ymd]);

  const handleDate = (date, day) => {
    // setDate(date);
    if (handleCalendar) {
      handleCalendar(year, month, date, day);
    }
  };

  return (
    <Stack direction={'row'} spacing={0.5}>
      {dates &&
        dates.map((week, index) => {
          return (
            <Stack
              spacing={1}
              alignItems={'center'}
              key={index}
              sx={{
                width: '100%',
                py: 1,
                border: selected && week.date === selected.date ? 1 : 0,
              }}
              onClick={() => handleDate(week.date, week.day)}
            >
              <Typography
                sx={{
                  ...text12,
                  color:
                    week.day === 0
                      ? 'error.main'
                      : week.day === 6
                      ? 'primary.main'
                      : '',
                }}
              >
                {CALENDAR_HEAD[week.day]}
              </Typography>
              <Typography sx={text14B}>{week.date}</Typography>
            </Stack>
          );
        })}
    </Stack>
  );
};

const createWeekCalendarDate = (ymd, date) => {
  const day = getDay(ymd);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    dates.push({ date: String(date + i).padStart(2, '0'), day: (day + i) % 7 });
  }
  return dates;
};

export default CalendarWeek;
