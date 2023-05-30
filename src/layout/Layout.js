import { Outlet } from 'react-router-dom';
// material
import { CssBaseline, Stack } from '@mui/material';
// layout
import Footer from './Footer';

const Layout = () => {
  return (
    <>
      <Stack sx={{ mb: 7 }}>
        <CssBaseline />
        <Outlet />
      </Stack>
      <Footer />
    </>
  );
};

export default Layout;
