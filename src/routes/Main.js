import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'components/ui/Loadable';
// helper
import { checkLoggedIn } from 'helpers/storage';
// config
import { path } from 'config/path';

// inventory routing
const Home = Loadable(lazy(() => import('pages/Home')));
const BookingItems = Loadable(lazy(() => import('pages/booking/Booking')));
const BookingEdit = Loadable(lazy(() => import('pages/booking/BookingEdit')));
const TicketItems = Loadable(lazy(() => import('pages/ticket/Ticket')));
const TicketLesson = Loadable(lazy(() => import('pages/ticket/Lesson')));
const TicketMachine = Loadable(lazy(() => import('pages/ticket/Machine')));

const PrivateRoute = ({ component: Component }) => {
  if (checkLoggedIn()) {
    return <Component />;
  }
  return <Navigate to={path.urls.login} />;
};

const Main = {
  path: path.urls.default,
  element: <MainLayout />,
  children: [
    {
      path: path.urls.default,
      element: <Navigate to={path.default} />,
    },
    {
      path: path.urls.home,
      element: <PrivateRoute component={Home} />,
    },
    {
      path: path.urls.bookings,
      element: <PrivateRoute component={BookingItems} />,
    },
    {
      path: path.urls.bookingEdit,
      element: <PrivateRoute component={BookingEdit} />,
    },
    {
      path: path.urls.tickets,
      element: <PrivateRoute component={TicketItems} />,
    },
    {
      path: path.urls.ticketLesson,
      element: <PrivateRoute component={TicketLesson} />,
    },
    {
      path: path.urls.ticketMachine,
      element: <PrivateRoute component={TicketMachine} />,
    },
  ],
};

export default Main;
