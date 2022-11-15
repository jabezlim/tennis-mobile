import { Outlet } from 'react-router-dom';
// components
import { MessageModal } from 'components/ui/modal';

const MinimalLayout = () => (
  <>
    <Outlet />
    <MessageModal />
  </>
);

export default MinimalLayout;
