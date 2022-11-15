// icon
import bookClock20Filled from '@iconify/icons-fluent/book-clock-20-filled';
// config
import { path } from 'config/path';

const booking = {
  title: '예약',
  caption: 'Booking',
  type: 'group',
  icon: bookClock20Filled,
  children: [
    {
      id: 'bookings',
      title: '예약내역',
      type: 'item',
      url: path.urls.bookings,
    },
    {
      id: 'booking-edit',
      title: '예약하기',
      type: 'item',
      url: path.urls.bookingEdit,
    },
  ],
};

// const booking = {
//   title: '예약',
//   caption: 'Booking',
//   type: 'group',
//   children: [
//     {
//       id: 'booking',
//       title: '예약',
//       type: 'collapse',
//       icon: bookClock20Filled,
//       children: [
//         {
//           id: 'bookings',
//           title: '예약 내역',
//           type: 'item',
//           url: path.urls.bookings,
//         },
//         {
//           id: 'booking-edit',
//           title: '예약 하기',
//           type: 'item',
//           url: path.urls.bookingEdit,
//         },
//       ],
//     },
//   ],
// };

export default booking;
