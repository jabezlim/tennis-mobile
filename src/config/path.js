export const image_path =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost/tennis/images'
    : '/tennis/images';

export const path = {
  image: image_path,
  basename: '/tennis/mob',
  default: '/home',
  urls: {
    default: '/',
    login: '/login',
    register: '/register',
    profile: '/profile',
    pwInquiry: '/pw-inquiry',
    home: '/home',
    memberBarcode: '/member/barcode',
    memberVideos: '/member/videos',
    booking: '/booking/booking',
    bookingEdit: '/booking/booking-edit',
    tickets: '/ticket/tickets',
    ticketLesson: '/ticket/lesson',
    ticketMachine: '/ticket/machine',
  },
};
