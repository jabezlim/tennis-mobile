import { forwardRef, useImperativeHandle, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// material
import { Modal, Stack, Typography } from '@mui/material';
// components
import { TButton } from '../button';
// config
import { path } from 'config/path';
import { text16 } from 'config/styles';
// helpers
import { getAuthStore, removeAuthData } from 'helpers/storage';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '92%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'common.white',
};
const LogoutModal = forwardRef((_, ref) => {
  const navigate = useNavigate();
  // data
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open() {
      setOpen(true);
    },
  }));

  const handleLogout = async () => {
    const url = `${path.urls.login}/${getAuthStore().id}`;
    removeAuthData();
    navigate(url);
  };

  return (
    <Modal open={open}>
      <Stack sx={{ ...style }}>
        <Typography
          sx={{
            ...text16,
            fontWeight: 700,
            textAlign: 'center',
            py: 8,
          }}
        >
          로그아웃 하시겠어요?
        </Typography>
        <Stack direction={'row'} spacing={1} sx={{ p: 2 }}>
          <TButton label='취소' color='grey' onClick={() => setOpen(false)} />
          <TButton label='로그아웃' onClick={handleLogout} />
        </Stack>
      </Stack>
    </Modal>
  );
});

export default LogoutModal;
