import { forwardRef, useRef, useState } from 'react';
import { isInteger } from 'lodash';
// material
import { Stack, Typography } from '@mui/material';
// graphql
import { useLazyQuery, useMutation } from '@apollo/client';
import { MEMBER_QUERY } from 'graphql/query';
import { MEMBER_UPDATE_QUERY } from 'graphql/mutation';
// components
import { DialogContainer } from 'components/page';
import { EditContactFormField, EditFormField } from 'components/ui';
import { MessageAlert } from 'components/ui/snackbar';
// config
import { text11 } from 'config/styles';
import { CheckIcon } from 'config/icons';
import { ICON_COLOR_CSS } from 'config/constants';

const MyProfile = forwardRef((_, ref) => {
  const nameRef = useRef();
  const passwordRef = useRef();
  const alertRef = useRef();
  // data
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [alert, setAlert] = useState({ color: '', message: '' });
  const [errors, setErrors] = useState({ password: false });

  // graphql
  const [getMember] = useLazyQuery(MEMBER_QUERY, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data.clt_member) {
        setName(data.clt_member.name);
        setPassword('');
        setPhone(data.clt_member.contact);
      }
    },
  });
  const [updateMember] = useMutation(MEMBER_UPDATE_QUERY, {
    onCompleted: (data) => {
      setAlert({
        color: data.clt_updatemember.status ? '' : 'error.main',
        message: data.clt_updatemember.message,
      });
      alertRef.current.open();
    },
    onError: (error) => console.log(error),
  });

  // page open
  const handleOpen = (open) => {
    if (open) {
      getMember();
      setPassword('');
    }
  };

  // name
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleName = () => {
    updateMember({ variables: { name: name } });
    nameRef.current.readOnlyToggle(true);
  };

  // password
  const handlePasswordChange = (e) => {
    let passwordError = false;
    if (
      !isInteger(Number(e.target.value)) ||
      (e.target.value.length > 0 && e.target.value.length < 6)
    ) {
      passwordError = true;
    }
    setPassword(e.target.value);
    setErrors((errors) => {
      return { ...errors, password: passwordError };
    });
  };
  const handlePassword = () => {
    if (!errors.password) {
      updateMember({ variables: { password: password } });
      passwordRef.current.readOnlyToggle(true);
    }
  };

  return (
    <DialogContainer ref={ref} title='예약자정보 수정' handleOpen={handleOpen}>
      <Stack spacing={2.625}>
        <EditFormField
          ref={nameRef}
          label={'이름'}
          value={name}
          onChange={handleNameChange}
          onClick={handleName}
        />
        <Stack spacing={1}>
          <EditFormField
            ref={passwordRef}
            label={'비밀번호'}
            type='password'
            placeholder='비밀번호를 설정해 주세요.'
            value={password}
            onChange={handlePasswordChange}
            onClick={handlePassword}
            error={errors.password}
          />
          <Stack direction={'row'} sx={{ color: 'error.main' }}>
            <CheckIcon
              sx={{
                width: 9.96,
                height: 7.52,
                mt: 0.2,
                filter: ICON_COLOR_CSS.red,
              }}
            />
            <Typography color={'error'} sx={{ ml: 0.5, ...text11 }}>
              숫자로만 구성
            </Typography>
            <CheckIcon
              sx={{
                width: 9.96,
                height: 7.52,
                mt: 0.2,
                ml: 1.5,
                filter: ICON_COLOR_CSS.red,
              }}
            />
            <Typography color={'error'} sx={{ ml: 0.5, ...text11 }}>
              6자 이상
            </Typography>
          </Stack>
        </Stack>
        <EditContactFormField phone={phone} />
      </Stack>
      <MessageAlert
        ref={alertRef}
        color={alert.color}
        message={alert.message}
      />
    </DialogContainer>
  );
});

export default MyProfile;
