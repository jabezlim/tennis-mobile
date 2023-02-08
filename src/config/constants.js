import { path } from './path';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';

// theme constant
export const drawerWidth = 260;
export const appDrawerWidth = 320;

// local storage
export const LOCAL_STORAGE_KEY = 'TENNIS.MoBile#Storage$KEY_77^^Ray';

// image constant
export const ONE_MEGE_TO_BYTE = 1000000; // 1M :1000000 Byte;
export const IMAGE_MAX_FILE_SIZE = ONE_MEGE_TO_BYTE;
export const IMAGE_MAIN_MAX_WIDTH = 1920;
export const IMAGE_MAIN_MAX_HEIGHT = 1080;
export const IMAGE_MENU_MAX_WIDTH = 700;
export const IMAGE_MENU_MAX_HEIGHT = 700;

// date constant
export const DefaultDate = '2022-01-01';
export const DATE_FORMAT = 'yyyy-MM-dd';
export const TIME_FORMAT = 'HH:mm:ss';
export const DATETIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';
export const TIME_FORMAT_AM_PM = 'hh:mm a';

// data constant
export const HOME_LIST = [
  // { label: '바코드보기', path: path.urls.memberBarcode },
  { label: '예약하기', path: path.urls.bookingEdit, icon:<AccessAlarmIcon sx={{":first-of-type" : {fontSize : '40px'}}} />},
  { label: '시설이용권', path: path.urls.ticketMachine, icon:<ConfirmationNumberIcon sx={{":first-of-type" : {fontSize : '40px'}}} /> },
  { label: '레슨수강', path: path.urls.ticketLesson, icon:<SportsTennisIcon sx={{":first-of-type" : {fontSize : '40px'}}} /> },
];

export const CALENDAR_HEAD = ['일', '월', '화', '수', '목', '금', '토'];
export const DAY_OF_WEEK = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
};
export const DAY_OF_WEEK_CODE = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};
export const DAY_OF_WEEK_KO = {
  monday: '월요일',
  tuesday: '화요일',
  wednesday: '수요일',
  thursday: '목요일',
  friday: '금요일',
  saturday: '토요일',
  sunday: '일요일',
};
export const DAY_OF_WEEK_LABEL_VALUE = [
  { value: 'monday', label: '월요일' },
  { value: 'tuesday', label: '화요일' },
  { value: 'wednesday', label: '수요일' },
  { value: 'thursday', label: '목요일' },
  { value: 'friday', label: '금요일' },
  { value: 'saturday', label: '토요일' },
  { value: 'sunday', label: '일요일' },
];

export const CATEGORIES = [
  { value: '1', label: '레슨수강' },
  { value: '2', label: '시설이용권' },
];
export const CATEGORY_TYPE = {
  1: '레슨수강',
  2: '시설이용권',
};

export const PERIOD_TYPE = {
  1: '회', //'회/월',
  2: '시간',
  3: '분',
};
export const LESSON_TYPE = {
  0: '',
  1: '개인',
  2: '단체',
  3: '개인 & 단체',
};
export const PAY_TYPE = {
  0: '관리자 등록',
  1: '카드',
  2: '현금',
};
export const PAY_TO = {
  kiosk: '지점 결제',
  mobile: '모바일 결제',
};
export const BOOKING_TYPE = {
  machine: '스크린 로봇, 코트',
  lesson: '레슨',
};
