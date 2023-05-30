import { useEffect, useState } from 'react';
import { parseISO } from 'date-fns';
import { chunk } from 'lodash';
// material
import { Stack, Typography } from '@mui/material';
// config
import { text12, text14B } from 'config/styles';
import { CALENDAR_HEAD } from 'config/constants';
// helpers
import { createCalendarDate } from 'helpers/calendar';

const CalendarMonth = ({ ymd, selected, handleCalendar }) => {
  // data
  const [calendar, setCalendar] = useState();
  const [today, setToday] = useState();
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  // const [date, setDate] = useState();

  useEffect(() => {
    const temp = new Date();
    const y = String(temp.getFullYear());
    const m = String(temp.getMonth() + 1).padStart(2, '0');
    const d = String(temp.getDate()).padStart(2, '0');

    setToday({ year: y, month: m, date: d });
  }, []);

  useEffect(() => {
    const temp = ymd ? parseISO(ymd) : new Date();
    const y = String(temp.getFullYear());
    const m = String(temp.getMonth() + 1).padStart(2, '0');
    // const d = String(temp.getDate()).padStart(2, '0');

    setYear(y);
    setMonth(m);
    // setDate(d);

    setCalendar(createCalendarDate(y, m));
  }, [ymd]);

  const handleDate = (date, day) => {
    // setDate(date);
    if (handleCalendar) {
      handleCalendar(year, month, date, day);
    }
  };

  return (
    <Stack spacing={0.5}>
      <Stack direction={'row'} spacing={0.5}>
        {[0, 1, 2, 3, 4, 5, 6].map((day, index) => (
          <Typography
            sx={{
              ...text12,
              width: '100%',
              height: 40,
              lineHeight: '40px',
              textAlign: 'center',
              color: day === 0 ? 'error.main' : day === 6 ? 'primary.main' : '',
            }}
            key={index}
          >
            {CALENDAR_HEAD[day]}
          </Typography>
        ))}
      </Stack>
      {calendar &&
        chunk(calendar, 7).map((dates, index) => {
          return (
            <CalendarDate
              key={index}
              today={today}
              year={year}
              month={month}
              selected={selected}
              dates={dates}
              onClick={handleDate}
            />
          );
        })}
    </Stack>
  );
};

const CalendarDate = ({ today, year, month, selected, dates, onClick }) => {
  const handleClick = (date, day) => {
    if (date !== '00' && onClick) onClick(date, day);
  };
  return (
    <Stack direction={'row'} spacing={0.5}>
      {dates.map((d, index) => {
        const dd = String(d).padStart(2, '0');
        const isSelected =
          selected &&
          selected.year === year &&
          selected.month === month &&
          selected.date === dd;
        const disabled =
          today.year === year && today.month === month && today.date > dd;
        return (
          <Typography
            sx={{
              ...text14B,
              width: '100%',
              height: 40,
              lineHeight: '40px',
              textAlign: 'center',
              border: isSelected ? 1 : 0,
              color: disabled
                ? 'grey.200'
                : index === 0
                ? 'error.main'
                : index === 6
                ? 'primary.main'
                : '',
            }}
            onClick={disabled ? () => {} : () => handleClick(dd, index)}
            key={index}
          >
            {dd === '00' ? '' : dd}
          </Typography>
        );
      })}
    </Stack>
  );
};

export default CalendarMonth;
