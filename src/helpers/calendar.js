import {
  addDays,
  addMonths,
  format,
  getDay,
  isDate,
  isValid,
  lastDayOfMonth,
  parseISO,
} from 'date-fns';
import { DATE_FORMAT } from 'config/constants';

export const createCalendarDate = (year, month) => {
  const date = new Date(Number(year), Number(month) - 1, 1);
  const lastDay = Number(format(lastDayOfMonth(date), 'dd'));
  const dates = [];
  for (let i = 0; i < getDay(date); i++) {
    dates.push(0);
  }
  for (let i = 1; i <= lastDay; i++) {
    dates.push(i);
  }
  const lastEmpty = 7 - (dates.length % 7);
  if (lastEmpty < 7) {
    for (let i = 0; i < lastEmpty; i++) {
      dates.push(0);
    }
  }
  return dates;
};

export const getNewDate = (year, month, type) => {
  const date = parseISO(`${year}-${month}-01`);
  let newDate = null;
  if (type === 'today') {
    newDate = new Date();
  } else if (type === 'prev') {
    newDate = addMonths(date, -1);
  } else if (type === 'next') {
    newDate = addMonths(date, 1);
  }
  return {
    year: newDate.getFullYear(),
    month: newDate.getMonth() + 1,
    day: newDate.getDate(),
  };
};

export const checkBookDate = (date, period, booked) => {
  let result = true;
  const currentDate = parseISO(date);
  if (isValid(currentDate)) {
    for (let i = 0; i < period; i++) {
      const temp = format(addDays(currentDate, i * 7), DATE_FORMAT);
      if (booked && booked[temp]) {
        if (
          booked[temp].booking ||
          booked[temp].booked === booked[temp].limit
        ) {
          result = false;
          break;
        }
      }
    }
  } else result = false;
  return result;
};
export const checkBookDateOLD = (date, lesson, booked) => {
  let result = true;
  const currentDate = parseISO(date);
  for (let i = 0; i < Number(lesson.period); i++) {
    const temp = format(addDays(currentDate, i * 7), DATE_FORMAT);
    if (booked && booked[temp]) {
      if (booked[temp].book || booked[temp].booked === booked[temp].limit) {
        result = false;
        break;
      }
    }
  }
  return result;
};
