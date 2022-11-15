import { lazy } from 'react';
// config
import { path } from 'config/path';
// project imports
import Loadable from 'components/ui/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

const Login = Loadable(lazy(() => import('pages/auth/Login')));
const Password = Loadable(lazy(() => import('pages/auth/Password')));
const Register = Loadable(lazy(() => import('pages/auth/Register')));

const Authentication = {
  path: path.urls.default,
  element: <MinimalLayout />,
  children: [
    {
      path: path.urls.login,
      element: <Login />,
    },
    {
      path: `${path.urls.login}/:storeid`,
      element: <Login />,
    },
    {
      path: path.urls.pwInquiry,
      element: <Password />,
    },
    {
      path: `${path.urls.pwInquiry}/:storeid`,
      element: <Password />,
    },
    {
      path: path.urls.register,
      element: <Register />,
    },
    {
      path: `${path.urls.register}/:storeid`,
      element: <Register />,
    },
  ],
};

export default Authentication;
