// material
import { Modal, Stack, Typography } from '@mui/material';
// components
import { TButton } from '../button';
// config
import { CheckCircleIcon } from 'config/icons';
import { text12_21 } from 'config/styles';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '92%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'common.white',
};
const AlertModal = ({
  open,
  alert,
  error = false,
  onClick,
  label = '확인',
  align = 'left',
}) => {
  return (
    <Modal open={open}>
      <Stack sx={{ ...style }}>
        <Stack spacing={0.8} sx={{ p: 3 }}>
          <CheckCircleIcon
            color={error ? 'red' : ''}
            sx={{ width: 33.33, height: 33.33, mx: 'auto' }}
          />
          <Typography
            sx={{
              pt: 2,
              textAlign: align,
              color: error ? 'error.main' : 'common.black',
              ...text12_21,
            }}
          >
            {alert}
          </Typography>
        </Stack>
        {onClick && (
          <TButton label={label} sx={{ borderRadius: 0 }} onClick={onClick} />
        )}
      </Stack>
    </Modal>
  );
};

export default AlertModal;
