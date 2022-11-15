import { useRoutes } from 'react-router-dom';
// routes
import MainRoutes from './Main';
import MemberRoutes from './Member';
import AuthenticationRoutes from './Authentication';

const Router = () => {
  return useRoutes([MainRoutes, MemberRoutes, AuthenticationRoutes]);
};

export default Router;
