import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
// material
import { styled } from '@mui/material/styles';
import { Box, Fade, IconButton, Modal } from '@mui/material';
// icon
import { Icon } from '@iconify/react';
import closeOutline from '@iconify/icons-eva/close-outline';

const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.common.white,
  boxShadow: 24,
  border: `2px solid ${theme.palette.primary.dark}`,
  [theme.breakpoints.down('sm')]: {
    top: 5,
    left: '50%',
    transform: 'translate(-50%, 0)',
    border: `1px solid ${theme.palette.primary.dark}`,
  },
}));

const FadeModal = ({
  open,
  setOpen,
  maxWidth = 410,
  minWidth = 400,
  children,
  closeBtn = false,
  ...other
}) => {
  const theme = useTheme();
  return (
    <Modal
      aria-labelledby='modal-title'
      aria-describedby='modal-description'
      open={open}
      {...other}
      closeAfterTransition
    >
      <Fade in={open}>
        <ModalBox
          sx={{
            maxWidth,
            minWidth,
            p: 3,
            [theme.breakpoints.down('sm')]: {
              px: 1,
              py: 2,
              minWidth: '98%',
            },
          }}
        >
          {closeBtn && (
            <IconButton
              color='inherit'
              sx={{ position: 'absolute', right: 3, top: 3 }}
              onClick={() => setOpen(false)}
            >
              <Icon icon={closeOutline} color='#d32f2f' width='30' />
            </IconButton>
          )}
          {children}
        </ModalBox>
      </Fade>
    </Modal>
  );
};

FadeModal.propTypes = {
  open: PropTypes.bool,
  maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  minWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  children: PropTypes.node,
};

export default FadeModal;
