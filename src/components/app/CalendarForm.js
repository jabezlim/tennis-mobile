import { useEffect, useState } from 'react';
import { format, getDay } from 'date-fns';
// material
import { Menu, Stack, Typography } from '@mui/material';
// components
import Calendar from './Calendar';
// config
import { text11, text14 } from 'config/styles';
import { CalendarMonthIcon, ChevronDownIcon } from 'config/icons';
import { CALENDAR_HEAD } from 'config/constants';

const CalendarForm = ({ label, handleDate }) => {
  // data
  const [date, setDate] = useState();
  const [day, setDay] = useState();
  const [calendar, setCalendar] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!date && !day) {
      const temp = new Date();
      const y = String(temp.getFullYear());
      const m = String(temp.getMonth() + 1).padStart(2, '0');
      const d = String(temp.getDate()).padStart(2, '0');
      const dd = getDay(temp);

      handleSelectDate({ year: y, month: m, date: d, day: dd });
    }
  }, [date, day]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSelectDate = (date) => {
    setDate(`${date.year}. ${date.month}. ${date.date}`);
    setDay(CALENDAR_HEAD[date.day]);
    setCalendar(`${date.year}-${date.month}-${date.date}`);
    if (handleDate) handleDate(date);
  };

  return (
    <Stack spacing={0.5}>
      {label && <Typography sx={text11}>{label}</Typography>}
      <Stack
        direction={'row'}
        spacing={1.5}
        alignItems={'center'}
        sx={{
          height: 44,
          px: 2,
          bgcolor: open ? 'common.white' : 'grey.100',
          border: open ? 1 : 0,
          borderBottom: 0,
          borderColor: 'grey.800',
        }}
        onClick={handleClick}
      >
        <CalendarMonthIcon color='grey' sx={{ width: 15, height: 16.67 }} />
        <Typography sx={{ ...text14, width: '100%' }}>
          {date} ({day})
        </Typography>
        <ChevronDownIcon sx={{ width: 5.48, height: 9.42 }} />
      </Stack>
      <Menu
        open={open}
        anchorEl={anchorEl}
        elevation={0}
        sx={{
          '& .MuiMenu-paper': {
            width: '100%',
            border: 1,
            borderRadius: 0,
            borderColor: 'grey.800',
            p: 1.5,
          },
        }}
        onClose={handleClose}
      >
        <Calendar onlyMonth calendar={calendar} handleDate={handleSelectDate} />
      </Menu>
    </Stack>
  );
};

export default CalendarForm;
