import { forwardRef, useImperativeHandle, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// material
import { Modal, Stack, Typography } from '@mui/material';
// graphql
import { useMutation } from '@apollo/client';
import { REMOVE_MEMBER_QUERY } from 'graphql/mutation';
// components
import { TButton } from '../button';
// config
import { path } from 'config/path';
import { text12, text16 } from 'config/styles';
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
const AccountOffModal = forwardRef((_, ref) => {
  const navigate = useNavigate();
  // data
  const [open, setOpen] = useState(false);
  // graphql
  const [removeMember] = useMutation(REMOVE_MEMBER_QUERY, {
    onCompleted: (data) => {
      if (data.clt_remove_member.status) {
        alert(data.clt_remove_member.message);
        const url = `${path.urls.login}/${getAuthStore().id}`;
        removeAuthData();
        navigate(url);
      }
    },
    onError: (error) => console.log(error),
  });

  useImperativeHandle(ref, () => ({
    open() {
      setOpen(true);
    },
  }));

  const handleAccount = async () => {
    console.log('remove account');
    removeMember();
  };

  return (
    <Modal open={open}>
      <Stack sx={{ ...style }}>
        <Typography
          sx={{
            ...text16,
            fontWeight: 700,
            textAlign: 'center',
            pt: 6,
          }}
        >
          회원을 탈퇴하시겠습니까?
        </Typography>
        <Typography
          sx={{ ...text12, textAlign: 'center', color: 'grey.800', mt: 1 }}
        >
          잔여 이용권, 레슨권, 동영상, 개인정보 등
        </Typography>
        <Typography
          sx={{
            ...text12,
            textAlign: 'center',
            color: 'grey.800',
            mt: 0.5,
            mb: 3,
          }}
        >
          모든 정보가 사라집니다.
        </Typography>
        <Stack direction={'row'} spacing={1} sx={{ p: 2 }}>
          <TButton label='취소' color='grey' onClick={() => setOpen(false)} />
          <TButton label='회원 탈' color='error' onClick={handleAccount} />
        </Stack>
      </Stack>
    </Modal>
  );
});

export default AccountOffModal;
