import { forEach, sortBy } from 'lodash';
import { addMinutes, differenceInMinutes, format, parseISO } from 'date-fns';
// config
import { TIME_FORMAT } from 'config/constants';

const BOOK_COLORS = ['primary', 'error', 'orange', 'warning', 'success'];

export const createBookedData = (booked) => {
  if (booked.length > 0) {
    const bookings = {};
    forEach(booked, (booking, index) => {
      if (!bookings[booking.machine_id]) bookings[booking.machine_id] = {};
      const color = BOOK_COLORS[index % BOOK_COLORS.length];
      const startDateTime = parseISO(
        booking.start_date + ' ' + booking.start_time
      );
      const endDateTime = parseISO(booking.end_date + ' ' + booking.end_time);
      const rows = differenceInMinutes(endDateTime, startDateTime) / 15;
      for (let i = 0; i < rows; i++) {
        const time = format(addMinutes(startDateTime, i * 15), TIME_FORMAT);
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

export const createContinuousTime = (times) => {
  const sortedTimes = sortBy(times, (t) => t);
  const selectedTimes = [];
  const startTime = parseISO(sortedTimes[0]);
  const endTime = parseISO(sortedTimes[1]);
  const period = differenceInMinutes(endTime, startTime) / 15;
  for (let i = 0; i <= period; i++) {
    selectedTimes.push(format(addMinutes(startTime, i * 15), TIME_FORMAT));
  }
  return selectedTimes;
};
