export const image_path =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost/tennis/images'
    : '/tennis/images';

export const cibase =
  process.env.NODE_ENV === 'development'
    ? 'http://tennissquad.local.tst/design/ci/index.php/api/v1/'
    : '/design/ci/index.php/api/v1/';
    
export const path = {
  image: image_path,
  basename: '/tennis/snumob',
  default: '/booking/booking',
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
