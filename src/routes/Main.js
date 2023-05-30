import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
// components
import Loadable from 'components/ui/Loadable';
// layout
import { Layout } from 'layout';
// helper
import { checkLoggedIn } from 'helpers/storage';
// config
import { path } from 'config/path';

// tennis routing
const Home = Loadable(lazy(() => import('pages/home/Home')));
const Booking = Loadable(lazy(() => import('pages/booking/Booking')));
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
  element: <Layout />,
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
      path: path.urls.booking,
      element: <PrivateRoute component={Booking} />,
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
