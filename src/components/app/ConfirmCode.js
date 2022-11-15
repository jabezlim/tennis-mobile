import { useEffect, useState } from 'react';
// material
import {
  Alert,
  Button,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
// graphql
import { useMutation } from '@apollo/client';
import { CONFIRM_CODE_QUERY } from 'graphql/mutation';
// utils
import { convertSecondsToFormat } from 'utils/formatDateTime';
// hooks
import { useInterval } from 'hooks';

const ConfirmCode = ({
  store,
  phone,
  isMember,
  isDone = false,
  prevPhone,
  setConfirmCode,
  handleConfirm,
}) => {
  // data
  const [count, setCount] = useState(0);
  const [disableCount, setDisableCount] = useState(0);
  const [code, setCode] = useState('');
  const [readOnly, setReadOnly] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'error',
    message: '',
  });
  // graphql
  const [getConfirmCode] = useMutation(CONFIRM_CODE_QUERY, {
    onCompleted: (data) => {
      if (data.clt_confirmcode.status) {
        setCount(600);
        setDisableCount(10);
        setReadOnly(false);
        setSnackbar({
          open: true,
          severity: 'success',
          message: '인증코드가 전송되었습니다.',
        });
      } else {
        setCount(0);
        setDisableCount(0);
        setReadOnly(true);
        setSnackbar({
          open: true,
          severity: 'error',
          message: data.clt_confirmcode.message,
        });
      }
    },
    onError: (error) => console.log(error),
  });

  useInterval(
    () => {
      setCount((prevData) => {
        return prevData - 1;
      });
    },
    count === 0 ? null : 1000
  );

  useInterval(
    () => {
      setDisableCount((prevData) => {
        return prevData - 1;
      });
    },
    disableCount === 0 ? null : 1000
  );

  useEffect(() => {
    if (code && code.length === 6) {
      if (setConfirmCode) setConfirmCode(code);
    }
    // eslint-disable-next-line
  }, [code]);

  useEffect(() => {
    if (isDone) {
      setCode('');
      setCount(0);
      setDisableCount(0);
      setReadOnly(true);
    }
  }, [isDone]);

  const handleChange = (e) => {
    setCode(e.target.value);
  };
  const handleConfirmCode = () => {
    if (prevPhone && prevPhone === phone) {
      setSnackbar({
        open: true,
        severity: 'error',
        message: '새로운 핸드폰 번호를 입력하세요.',
      });
      if (handleConfirm) {
        handleConfirm('check_phone');
      }
      return;
    }

    if (phone && phone.length > 9 && store) {
      const variables = {
        store: store,
        phone: phone,
      };
      if (isMember) {
        variables.isMember = isMember;
      }
      if (prevPhone) {
        variables.prevPhone = prevPhone;
      }
      getConfirmCode({ variables });
    } else {
      setSnackbar({
        open: true,
        severity: 'error',
        message: '핸드폰 번호를 확인하세요.',
      });
      if (handleConfirm) {
        handleConfirm('check_phone');
      }
    }
  };
  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({
      open: false,
      severity: 'error',
      message: '',
    });
  };

  return (
    <>
      <Stack spacing={0.7}>
        <Stack direction='row' spacing={1}>
          <TextField
            fullWidth
            color='tennis'
            autoComplete='code'
            type='text'
            label='인증코드 (6자리) *'
            value={code}
            onChange={handleChange}
            InputProps={{ readOnly: readOnly }}
          />
          <Button
            variant='contained'
            color='error'
            sx={{ width: 200, fontWeight: 700 }}
            onClick={handleConfirmCode}
            disabled={disableCount > 0}
          >
            인증코드 받기
          </Button>
        </Stack>
        <Stack direction={'row'} justifyContent='space-between'>
          <Typography variant='body2'>
            10분 이내로 인증코드를 입력해 주세요.
          </Typography>
          <Typography variant='body2' color={'error'} sx={{ fontWeight: 700 }}>
            {count > 0 && convertSecondsToFormat(count)}
          </Typography>
        </Stack>
      </Stack>
      <Snackbar
        open={snackbar.open}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant='filled'
          sx={{ width: '100%' }}
        >
          <Typography
            variant='h5'
            sx={{ color: 'common.white', fontSize: 18, fontWeight: 700 }}
          >
            {snackbar.message}
          </Typography>
        </Alert>
      </Snackbar>
    </>
  );
};

export default ConfirmCode;
