import { useEffect, useState } from 'react';
import { chunk, includes, padStart } from 'lodash';
import { differenceInMinutes, format, parseISO } from 'date-fns';
// material
import { Box, Button, Stack, Typography } from '@mui/material';
import { DATE_FORMAT } from 'config/constants';

const Minutes = ['00', '15', '30', '45'];
const TimeTableButtonText = ({
  start,
  end,
  color,
  text,
  textColor = 'error',
  disabled,
}) => {
  return (
    <Box>
      <Typography
        variant='subtitle1'
        color={disabled ? 'grey.500' : color}
        sx={{ lineHeight: 1.3 }}
      >
        {start}
      </Typography>
      <Typography
        variant='subtitle1'
        color={disabled ? 'grey.500' : color}
        sx={{ lineHeight: 1.3 }}
      >
        {end}
      </Typography>
      {text && (
        <Typography
          variant='subtitle2'
          color={disabled ? 'grey.500' : textColor}
        >
          {text}
        </Typography>
      )}
    </Box>
  );
};
const TimeTableButton = ({
  hour,
  discount,
  booked,
  lessons,
  bookingTimes,
  isToday,
  handleClick,
}) => {
  const today = new Date();
  const nowDate = isToday ? format(today, DATE_FORMAT) : '';
  return (
    <Stack direction='row' spacing={{ xs: 0.5, sm: 1 }}>
      {Minutes.map((minute, index) => {
        const time = `${hour}:${minute}:00`;
        const start = `${hour}:${minute}`;
        const end = `~ ${
          index < 3 ? hour : padStart(Number(hour) + 1, 2, '0')
        }:${index < 3 ? Minutes[index + 1] : Minutes[0]}`;

        const disabled = isToday
          ? differenceInMinutes(
              parseISO(`${nowDate} ${hour}:${minute}:00`),
              today
            ) < 1
          : false;

        const bookedColor = booked && booked[time];
        const lessonColor = lessons && lessons[time];
        if (bookedColor || lessonColor) {
          return (
            <Button
              fullWidth
              variant='contained'
              color={bookedColor || lessonColor}
              disabled={disabled}
              sx={{ height: 70, p: 0 }}
              key={index}
            >
              <TimeTableButtonText
                start={start}
                end={end}
                color='white'
                text={lessonColor && '레슨'}
                textColor={lessonColor && 'white'}
                disabled={disabled}
              />
            </Button>
          );
        }

        const selected = includes(bookingTimes, time);
        const discountValue = discount && discount[time];
        return (
          <Button
            fullWidth
            variant={selected ? 'contained' : 'outlined'}
            color='tennis'
            disabled={disabled}
            sx={{ height: 70, p: 0 }}
            onClick={() => handleClick(time)}
            key={index}
          >
            <TimeTableButtonText
              start={start}
              end={end}
              color={selected ? 'black' : 'black'}
              text={discountValue && `${discountValue}% 할인`}
              disabled={disabled}
            />
          </Button>
        );
      })}
    </Stack>
  );
};
const TimeTable = ({
  discount,
  booked,
  lessons,
  bookingTimes,
  isToday,
  handleClick,
}) => {
  // data
  const [timeList, setTimeList] = useState();

  useEffect(() => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(padStart(i, 2, '0'));
    }
    setTimeList(chunk(hours, 12));
  }, []);

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} maxWidth={750}>
      <Stack sx={{ width: '100%' }} spacing={{ xs: 0.5, sm: 1 }}>
        <Typography
          variant='h5'
          align='center'
          sx={{ fontWeight: 700, border: 1, py: 0.5 }}
        >
          오전 (AM)
        </Typography>
        {timeList &&
          timeList[0].map((hour, index) => {
            return (
              <TimeTableButton
                key={index}
                hour={hour}
                discount={discount}
                booked={booked}
                lessons={lessons}
                bookingTimes={bookingTimes}
                isToday={isToday}
                handleClick={handleClick}
              />
            );
          })}
      </Stack>
      <Stack sx={{ width: '100%' }} spacing={{ xs: 0.5, sm: 1 }}>
        <Typography
          variant='h5'
          align='center'
          sx={{ fontWeight: 700, border: 1, py: 0.5 }}
        >
          오후 (PM)
        </Typography>
        {timeList &&
          timeList[1].map((hour, index) => {
            return (
              <TimeTableButton
                key={index}
                hour={hour}
                discount={discount}
                booked={booked}
                lessons={lessons}
                bookingTimes={bookingTimes}
                isToday={isToday}
                handleClick={handleClick}
              />
            );
          })}
      </Stack>
    </Stack>
  );
};

export default TimeTable;
