import * as Yup from 'yup';
import { useRef, useState } from 'react';
import { startsWith } from 'lodash';
// material
import { LoadingButton } from '@mui/lab';
import {
  FormHelperText,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
// form
import { useFormik, Form, FormikProvider } from 'formik';
// icon
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
// graphql
import { useMutation, useQuery } from '@apollo/client';
import { MEMBER_QUERY } from 'graphql/query';
import { MEMBER_UPDATE_QUERY } from 'graphql/mutation';
// context
import { useGlobalContext } from 'context';
// component
import { MainCard } from 'components/ui/cards';
import { ConfirmCode } from 'components/app';
// helper
import { getAuthUser } from 'helpers/storage';
import { storeDataVar } from 'helpers/cache';
// hooks
import { useInterval } from 'hooks';
// util
import { matchFormValues } from 'utils/util';

const INIT_VALUES = {
  name: '',
  password: '',
  code: '',
  email: '',
  contact: '',
};
const Profile = () => {
  const phoneRef = useRef();
  const { settingMessage } = useGlobalContext();
  // data
  const [phone, setPhone] = useState();
  const [formValues, setFormValues] = useState(INIT_VALUES);
  const [showPassword, setShowPassword] = useState(false);
  const [codeCount, setCodeCount] = useState(0);
  const [confirmCode, setConfirmCode] = useState();
  const [isDone, setIsDone] = useState(false);
  // graphql
  useQuery(MEMBER_QUERY, {
    onCompleted: (data) => {
      if (data.clt_member) {
        handleData(data.clt_member);
      }
    },
  });
  const [updateMember, { loading }] = useMutation(MEMBER_UPDATE_QUERY, {
    onCompleted: (data) => {
      settingMessage('open', true);
      settingMessage('message', data.clt_updatemember.message);
      if (data.clt_updatemember.status && confirmCode) {
        setIsDone(true);
        setPhone(getFieldProps('contact').value);
      }
    },
    onError: (error) => console.log(error),
  });

  const ProfileSchema = Yup.object().shape({
    // contact: Yup.number()
    //   .typeError('핸드폰 번호는 숫자만 입력해 주세요')
    //   .required('핸드폰 번호는 필수 사항입니다.'),
    contact: Yup.string()
      .matches(/^[0-9]+$/, '핸드폰 번호는 숫자만 입력해 주세요.')
      .required('핸드폰 번호는 필수 사항입니다.'),
    password: Yup.string()
      .matches(/^[0-9]+$/, '숫자만 입력 가능합니다.')
      .min(6, '비밀번호는 6자리 이상입니다.'),
  });
  const formik = useFormik({
    initialValues: formValues,
    validationSchema: ProfileSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (
        values.contact !== phone &&
        (!confirmCode || confirmCode.length !== 6)
      ) {
        settingMessage('open', true);
        settingMessage(
          'message',
          '새로운 핸드폰 번호 등록 시 인증코드가 필요합니다.'
        );
        return;
      }

      setIsDone(false);
      const variables = {
        memberId: getAuthUser().id,
        phone: values.contact,
        name: values.name,
        email: values.email,
      };
      if (values.password) variables['password'] = values.password;
      if (values.contact !== phone && confirmCode && confirmCode.length === 6) {
        variables['prevPhone'] = phone;
        variables['code'] = confirmCode;
        if (startsWith(values.name, '010')) {
          variables.name = values.contact;
        }
      }
      updateMember({ variables });
    },
  });

  useInterval(
    () => {
      setCodeCount((prevData) => {
        return prevData - 1;
      });
    },
    codeCount === 0 ? null : 1000
  );

  const handleData = (data) => {
    const newValues = matchFormValues(INIT_VALUES, data);
    setPhone(data.contact);
    setFormValues((prev) => {
      return {
        ...prev,
        ...newValues,
      };
    });
  };
  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const handleConfirmCode = (type) => {
    if (type === 'check_phone') phoneRef.current.focus();
  };

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <MainCard darkTitle title='회원 정보 수정' contentSX={{ maxWidth: 500 }}>
      <FormikProvider value={formik}>
        <Form autoComplete='off' noValidate onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Stack spacing={0}>
              <TextField
                fullWidth
                color='tennis'
                autoComplete='contact'
                type='text'
                inputRef={phoneRef}
                label='핸드폰번호 *'
                {...getFieldProps('contact')}
                error={Boolean(touched.contact && errors.contact)}
                helperText={touched.contact && errors.contact}
              />
              <FormHelperText error>
                새로운 핸드폰 번호 등록 시 인증코드를 받으세요.
              </FormHelperText>
            </Stack>
            <ConfirmCode
              isDone={isDone}
              store={storeDataVar().id}
              phone={getFieldProps('contact').value}
              prevPhone={phone}
              setConfirmCode={setConfirmCode}
              handleConfirm={handleConfirmCode}
            />
            <TextField
              fullWidth
              color='tennis'
              autoComplete='password'
              type={showPassword ? 'text' : 'password'}
              label='비밀번호'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={handleShowPassword} edge='end'>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...getFieldProps('password')}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />
            <TextField
              fullWidth
              color='tennis'
              autoComplete='name'
              type='text'
              label='이름'
              {...getFieldProps('name')}
            />
            <TextField
              fullWidth
              color='tennis'
              autoComplete='email'
              type='email'
              label='이메일'
              {...getFieldProps('email')}
            />
            <LoadingButton
              fullWidth
              size='large'
              type='submit'
              color='tennis'
              variant='contained'
              loading={loading}
            >
              수정하기
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>
    </MainCard>
  );
};

export default Profile;
