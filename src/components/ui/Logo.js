// material
import { Box } from '@mui/material';
import { path } from 'config/path';

const Logo = ({ ball = false }) => {
  if (ball) {
    return (
      <Box
        component='img'
        src={path.basename + '/images/icon/logo_ball.svg'}
        sx={{ width: 121 }}
      />
    );
  }

  return (
    <Box
      component='img'
      src={path.basename + '/images/icon/logo.svg'}
      sx={{ width: 110 }}
    />
  );
};

export default Logo;
