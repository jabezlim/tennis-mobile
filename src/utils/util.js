import { forEach, includes } from 'lodash';
// config
import { DAY_OF_WEEK_KO } from 'config/constants';

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
};

export const matchFormValues = (initValues, values) => {
  const newValues = {};
  forEach(initValues, (_, key) => {
    newValues[key] = values[key] || '';
  });
  return newValues;
};

export const nullToEmpty = (datas) => {
  forEach(datas, (value, key) => {
    if (value === null) datas[key] = '';
  });
  return datas;
};

export const convertDayCodeToText = (days) => {
  if (days) {
    let temp = '';
    forEach(DAY_OF_WEEK_KO, (value, key) => {
      if (includes(days, key)) {
        temp += value + ', ';
      }
    });
    return temp.substring(0, temp.length - 2);
  }
  return null;
};
