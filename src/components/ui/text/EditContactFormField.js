import { useEffect, useRef, useState } from 'react';
// material
import { Stack, TextField, Typography } from '@mui/material';
// graphql
import { useMutation } from '@apollo/client';
import {
  CONFIRM_CODE_QUERY,
  MEMBER_CONTACT_UPDATE_QUERY,
} from 'graphql/mutation';
// components
import { ConfirmCodeBtn } from 'components/common';
import FormField from './FormField';
import { MessageAlert } from '../snackbar';
// config
import {
  text11,
  text12,
  textFieldInputProps,
  textFieldInputPropsSX,
  textFieldSX,
} from 'config/styles';
// helpers
import { getAuthStore } from 'helpers/storage';
// hooks
import { useInterval } from 'hooks';
// utils
import { convertSecondsToFormat } from 'utils/formatDateTime';

const EditContactFormField = ({ phone, autoFocus = true }) => {
  const inputRef = useRef();
  const alertRef = useRef();
  // data
  const [value, setValue] = useState('');
  const [btnLabel, setBtnLabel] = useState('인증받기');
  const [readOnly, setReadOnly] = useState(true);
  const [confirmCode, setConfirmCode] = useState();
  const [isCode, setIsCode] = useState(true);
  const [isSented, setIsSented] = useState(false);
  const [count, setCount] = useState(0);
  const [alert, setAlert] = useState({ color: '', message: '' });

  // graphql
  const [getConfirmCode] = useMutation(CONFIRM_CODE_QUERY, {
    onCompleted: (data) => {
      if (data.clt_confirmcode.status) {
        setCount(600);
        handleAlert(false, '인증코드가 전송되었습니다.');
        setIsSented(true);
      } else {
        handleAlert(true, data.clt_confirmcode.message);
        setIsSented(false);
      }
    },
    onError: (error) => console.log(error),
  });
  const [updateContact] = useMutation(MEMBER_CONTACT_UPDATE_QUERY, {
    onCompleted: (data) => {
      if (data.clt_updatemembercontact.status) {
        setBtnLabel('인증받기');
        setReadOnly(true);
        setIsCode(true);
        handleAlert(false, data.clt_updatemembercontact.message);
      } else {
        handleAlert(true, data.clt_updatemembercontact.message);
      }
    },
    onError: (error) => console.log(error),
  });

  useEffect(() => {
    if (phone) setValue(phone);
  }, [phone]);

  useEffect(() => {
    if (!readOnly && autoFocus) {
      inputRef.current.focus();
    }
    // eslint-disable-next-line
  }, [readOnly]);

  useEffect(() => {
    if (isSented) {
      setBtnLabel('수정');
      setIsCode(false);
    } else {
      setBtnLabel('인증받기');
      setIsCode(true);
    }
  }, [isSented]);

  useInterval(
    () => {
      setCount((prevData) => {
        return prevData - 1;
      });
    },
    count === 0 ? null : 1000
  );

  const handleConfirmCode = () => {
    const variables = {
      store: getAuthStore().id,
      phone: phone,
      newPhone: value,
    };
    getConfirmCode({ variables });
  };
  const handleEdit = () => {
    setReadOnly(false);
  };
  const handleBtnClick = () => {
    if (!readOnly) {
      if (isCode) {
        if (phone === value || value === '') {
          handleAlert(true, '새로운 전화번호를 입력해 주세요.');
        } else {
          handleConfirmCode();
        }
      } else {
        if (confirmCode && confirmCode.length > 0) {
          const variables = {
            phone: phone,
            newPhone: value,
            code: confirmCode,
          };
          updateContact({ variables });
        } else {
          handleAlert(true, '인증코드를 입력 후 확인해 주세요.');
        }
      }
    }
  };
  const handleConfirm = (code) => {
    setConfirmCode(code);
  };
  const handleAlert = (error, message) => {
    setAlert({ color: error ? 'error.main' : '', message: message });
    alertRef.current.open();
  };

  return (
    <Stack spacing={2.625}>
      <Stack spacing={0.5}>
        <Typography sx={text11}>전화번호</Typography>
        <TextField
          fullWidth
          inputRef={inputRef}
          variant='outlined'
          color='black'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          sx={textFieldSX}
          inputProps={textFieldInputProps}
          InputProps={{
            readOnly: readOnly,
            endAdornment: (
              <ConfirmCodeBtn
                readOnly={readOnly}
                handleEdit={handleEdit}
                btnLabel={btnLabel}
                handleClick={handleBtnClick}
              />
            ),
            sx: textFieldInputPropsSX,
          }}
        />
      </Stack>
      {!readOnly && isSented && (
        <CodeBox
          count={count}
          handleClick={handleConfirm}
          handleResend={handleConfirmCode}
        />
      )}
      <MessageAlert
        ref={alertRef}
        color={alert.color}
        message={alert.message}
      />
    </Stack>
  );
};

const CodeBox = ({ count, handleClick, handleResend }) => {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
    handleClick(e.target.value);
  };

  return (
    <Stack spacing={0.75}>
      <FormField
        autoFocus
        label={'전화번호 인증'}
        value={value}
        onChange={handleChange}
        // onChange={(e) => setValue(e.target.value)}
        // btnLabel={'인증하기'}
        // onClick={() => handleClick(value)}
      />
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Typography sx={text12}>
          {count > 0 && convertSecondsToFormat(count)}
        </Typography>
        <Typography
          color='error'
          sx={{ ...text12, textAlign: 'right' }}
          onClick={handleResend}
        >
          인증코드 재전송
        </Typography>
      </Stack>
    </Stack>
  );
};

export default EditContactFormField;
