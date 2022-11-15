// material
import { Box, useScrollTrigger, Zoom } from '@mui/material';
// util
import { scrollToTop } from 'utils/util';

const BackToTop = ({ children, window }) => {
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  return (
    <Zoom in={trigger}>
      <Box
        onClick={scrollToTop}
        role='presentation'
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Zoom>
  );
};

export default BackToTop;
