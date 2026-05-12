import { useEffect, useState } from 'react';
import { getDay, parseISO, startOfToday, addDays } from 'date-fns';
// material
import { Stack, Typography } from '@mui/material';
// config
import { CALENDAR_HEAD } from 'config/constants';
import { text12, text14B } from 'config/styles';
import { da } from 'date-fns/locale';

const CalendarWeek = ({ ymd, selected, handleCalendar }) => {
  // data
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  // const [date, setDate] = useState();
  const [dates, setDates] = useState();

  useEffect(() => {
    const temp = (ymd && parseISO(ymd)) || startOfToday(); // new Date();
    const y = String(temp.getFullYear());
    const m = String(temp.getMonth() + 1).padStart(2, '0');
    // const d = String(temp.getDate()).padStart(2, '0');

    setYear(y);
    setMonth(m);
    // setDate(d);

    setDates(createWeekCalendarDate(temp));
  }, [ymd]);

  const handleDate = (date) => {
    // setDate(date);
    if (handleCalendar) {
      handleCalendar(date);
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
                border: selected && week.getDate() === selected.getDate() ? 1 : 0,
                borderColor: 'tennis.main',
              }}
              onClick={() => handleDate(week)}
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
                {CALENDAR_HEAD[week.getDay()]}
              </Typography>
              <Typography sx={text14B}>{week.getDate()}</Typography>
            </Stack>
          );
        })}
    </Stack>
  );
};

const PERIOD = 7;
const createWeekCalendarDate = (ymd) => {
  const dates = [];
  for (let i = 0; i < PERIOD; i++) {
    dates.push(addDays(ymd, i));
  }
  // for (let i = 0; i < 4; i++) {
  //   dates.push({ date: String(date + i).padStart(2, '0'), day: (day + i) % 7 });
  // }
  return dates;
};

export default CalendarWeek;
