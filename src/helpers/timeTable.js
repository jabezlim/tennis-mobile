import { forEach, isEmpty, sortBy } from 'lodash';
import { addMinutes, differenceInMinutes, format, parseISO } from 'date-fns';
// config
import { DATETIME_FORMAT, TIME_FORMAT } from 'config/constants';

const BOOK_COLORS = ['primary', 'error', 'orange', 'warning', 'success'];

export const createBookedData = (booked, period) => {
  if (booked.length > 0) {
    const bookings = {};
    forEach(booked, (booking, index) => {
      if (!bookings[booking.machine_id]) bookings[booking.machine_id] = {};
      const color = BOOK_COLORS[index % BOOK_COLORS.length];
      const startDateTime = parseISO(
        booking.start_date + ' ' + booking.start_time
      );
      const endDateTime = parseISO(booking.end_date + ' ' + booking.end_time);
      const rows = differenceInMinutes(endDateTime, startDateTime) / period;
      for (let i = 0; i < rows; i++) {
        const time = format(addMinutes(startDateTime, i * period), TIME_FORMAT);
        bookings[booking.machine_id][time] = color;
      }
    });
    return bookings;
  }
  return {};
};

export const createLessonBookedData = (lessons) => {
  if (lessons.length > 0) {
    const temp = {};
    const check = { index: 0, program: '', color: '' };
    forEach(lessons, (lesson) => {
      if (!temp[lesson.machine_id]) temp[lesson.machine_id] = {};
      if (!temp[lesson.machine_id][lesson.day])
        temp[lesson.machine_id][lesson.day] = {};

      if (lesson.program_id !== check.program) {
        check.color = BOOK_COLORS[check.index % BOOK_COLORS.length];
        check.program = lesson.program_id;
        check.index = check.index + 1;
      }
      temp[lesson.machine_id][lesson.day][lesson.time] = check.color;
    });
    return temp;
  }
  return {};
};

export const createMachineData = (data, key) => {
  if (data.length > 0 && !isEmpty(key)) {
    const temp = {};
    forEach(data, (d) => {
      if (!temp[d[key]]) temp[d[key]] = [];
      temp[d[key]].push(d);
    });
    return temp;
  }
  return {};
};
export const createMachineBlockedData = (blocked) => {
  if (blocked.length > 0) {
    const temp = {};
    forEach(blocked, (block) => {
      if (!temp[block.machine_id]) temp[block.machine_id] = {};
      if (!temp[block.machine_id][block.day])
        temp[block.machine_id][block.day] = [];

      temp[block.machine_id][block.day].push(block.time);
    });
    return temp;
  }
  return {};
};

export const createContinuousTime = (times, period, type = 'datetime') => {
  const sortedTimes = sortBy(times, (t) => t);
  const selectedTimes = [];
  const startTime = parseISO(sortedTimes[0]);
  const endTime = parseISO(sortedTimes[1]);
  const periodTime = differenceInMinutes(endTime, startTime) / period;
  const timeFormat = type === 'time' ? TIME_FORMAT : DATETIME_FORMAT;
  for (let i = 0; i <= periodTime; i++) {
    selectedTimes.push(format(addMinutes(startTime, i * period), timeFormat));
  }
  return selectedTimes;
};
