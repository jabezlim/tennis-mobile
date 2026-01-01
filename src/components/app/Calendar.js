import { useEffect, useRef, useState } from 'react';
// material
import { Box, Fade, Slide, Stack, Typography } from '@mui/material';
// components
import CalendarMonth from './CalendarMonth';
import CalendarWeek from './CalendarWeek';
// config
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from 'config/icons';
import { text20B } from 'config/styles';
// helpers
import { getNewDate } from 'helpers/calendar';
import { getDay, parseISO, addDays, startOfToday } from 'date-fns';

const Calendar = ({ onlyMonth = false, calendar, handleDate }) => {
  const containerRef = useRef();
  // data
  const [today, setToday] = useState();
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [date, setDate] = useState();
  const [ymd, setYMD] = useState();
  const [selected, setSelected] = useState();
  const [isMonth, setIsMonth] = useState(onlyMonth);

  useEffect(() => {
    const temp = calendar ? parseISO(calendar) : startOfToday(); // new Date();
    const y = String(temp.getFullYear());
    const m = String(temp.getMonth() + 1).padStart(2, '0');
    const d = String(temp.getDate()).padStart(2, '0');
    const day = getDay(temp);

    setToday({ year: y, month: m, date: d, day: day });
    setSelected(temp);
    setYear(y);
    setMonth(m);
    setDate(d);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (year && month && date) {
      setYMD(`${year}-${month}-${date}`);
    }
  }, [year, month, date]);

  useEffect(() => {
    if (selected && handleDate) {
      handleDate(selected);
    }
    // eslint-disable-next-line
  }, [selected]);

  const handleClick = (type) => {
    if (year === today.year && month === today.month && type === 'prev') return;

    const { year: newYear, month: newMonth } = getNewDate(year, month, type);
    const y = newYear.toString();
    // const m = padStart(newMonth, 2, '0');
    const m = newMonth.toString().padStart(2, '0');

    setYear(y);
    setMonth(m);
  };
  const handleToggleCalendar = (type) => {
    // if (type === false) {
    setYear(today.year);
    setMonth(today.month);
    setSelected(today);
    // }
    setIsMonth(type);
  };
  const handleCalendar = (seldate) => {
    setSelected(seldate);
  };

  return (
    <Stack spacing={1}>
      {/* <Stack direction={'row'} alignItems={'center'} spacing={1.5}>
        {isMonth && (
          <ChevronLeftIcon
            sx={{ width: 7.4, height: 12 }}
            onClick={() => handleClick('prev')}
          />
        )}
        <Typography sx={text20B}>{`${year}.${month}`}</Typography>
        {isMonth && (
          <ChevronRightIcon
            sx={{ width: 7.4, height: 12 }}
            onClick={() => handleClick('next')}
          />
        )}
      </Stack> */}
      <Stack
        spacing={1.25}
        alignItems={'center'}
        ref={containerRef}
        sx={{ overflow: 'hidden' }}
      >
        <Slide direction='up' in={!isMonth} container={containerRef.current}>
          <Box
            sx={{
              display: isMonth ? 'none' : 'block',
              pt: 1.25,
              width: '100%',
            }}
          >
            <CalendarWeek selected={selected} handleCalendar={handleCalendar} />
          </Box>
        </Slide>
        {/* <Fade in={!isMonth}>
          <Box sx={{ display: isMonth ? 'none' : 'block' }}>
            <ChevronDownIcon
              sx={{ width: 12, height: 7.4 }}
              onClick={() => handleToggleCalendar(true)}
            />
          </Box>
        </Fade>
        <Slide direction='down' in={isMonth} container={containerRef.current}>
          <Box sx={{ display: isMonth ? 'block' : 'none', width: '100%' }}>
            <CalendarMonth
              ymd={ymd}
              selected={selected}
              handleCalendar={handleCalendar}
            />
          </Box>
        </Slide>
        <Fade in={isMonth}>
          <Box
            sx={{ display: onlyMonth ? 'none' : isMonth ? 'block' : 'none' }}
          >
            <ChevronUpIcon
              color='tennis'
              sx={{ width: 12, height: 7.4 }}
              onClick={() => handleToggleCalendar(false)}
            />
          </Box>
        </Fade> */}
      </Stack>
    </Stack>
  );
};

export default Calendar;
