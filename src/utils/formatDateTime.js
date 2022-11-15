import { format, formatDistanceToNow } from 'date-fns';

export const fDate = (date) => {
  return format(new Date(date), 'yyyy-MM-dd');
};

export const fDateTime = (date) => {
  return format(new Date(date), 'yyyy-MM-dd HH:mm');
};

export const fDateTimeSuffix = (date) => {
  return format(new Date(date), 'yyyy-MM-dd hh:mm a');
};

export const fTimeSuffix = (date) => {
  return format(new Date(date), 'hh:mm a');
};

export const fToNow = (date) => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
};

export const convertSecondsToDatetime = (s) => {
  const countDown = new Date(s * 1000);
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return [days, hours, minutes, seconds];
};
export const convertSecondsToFormat = (s, f) => {
  if (!f) f = 'mm:ss';
  return format(new Date(s * 1000), f);
};

// for ie
export const fDateIE = (date) => {
  return date.substring(0, 10);
};
export const fTimeIE = (date) => {
  return date.substring(11, 16);
};
export const fDateTimeIE = (date) => {
  return date.substring(0, 16);
};
