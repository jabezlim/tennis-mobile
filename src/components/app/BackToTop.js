// material
import { Box, Fab, useScrollTrigger, Zoom } from '@mui/material';
// config
import { ChevronUpIcon } from 'config/icons';
// util
import { scrollToTop } from 'utils/util';

const BackToTop = ({ window }) => {
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
        sx={{ position: 'fixed', bottom: 70, right: 16 }}
      >
        <Fab
          size='small'
          aria-label='scroll back to top'
          sx={{
            backgroundColor: 'common.black',
            '&:hover': { backgroundColor: 'common.black' },
          }}
        >
          <ChevronUpIcon color='white' />
        </Fab>
      </Box>
    </Zoom>
  );
};

export default BackToTop;
