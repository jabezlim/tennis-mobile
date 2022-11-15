import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'components/ui/Loadable';
// helper
import { checkLoggedIn } from 'helpers/storage';
// config
import { path } from 'config/path';

// member routing
const UserProfile = Loadable(lazy(() => import('pages/member/Profile')));
const MemberBarcode = Loadable(lazy(() => import('pages/member/Barcode')));

const PrivateRoute = ({ component: Component }) => {
  if (checkLoggedIn()) {
    return <Component />;
  }
  return <Navigate to={path.urls.login} />;
};

const Member = {
  path: path.urls.default,
  element: <MainLayout />,
  children: [
    {
      path: path.urls.profile,
      element: <PrivateRoute component={UserProfile} />,
    },
    {
      path: path.urls.memberBarcode,
      element: <PrivateRoute component={MemberBarcode} />,
    },
  ],
};

export default Member;
