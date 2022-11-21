import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// material
import { LoadingButton } from '@mui/lab';
import { IconButton, InputAdornment, Stack, TextField } from '@mui/material';
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
// helper
import { getAuthUser } from 'helpers/storage';
// config
import { path } from 'config/path';
// hooks
import { useInterval } from 'hooks';
// util
import { matchFormValues } from 'utils/util';

const INIT_VALUES = {
  name: '',
  password: '',
  password_confirm: '',
  code: '',
  email: '',
};
const Profile = () => {
  const navigate = useNavigate();
  const { message, settingMessage } = useGlobalContext();
  // data
  const [formValues, setFormValues] = useState(INIT_VALUES);
  const [showPassword, setShowPassword] = useState(false);
  const [codeCount, setCodeCount] = useState(0);
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
      setIsDone(true);
      settingMessage('open', true);
      settingMessage('message', data.clt_updatemember.message);
    },
    onError: (error) => console.log(error),
  });

  const ProfileSchema = Yup.object().shape({
    password: Yup.string()
      .matches(/^[0-9]+$/, '숫자만 입력 가능합니다.')
      .min(6, '비밀번호는 6자리 이상입니다.'),
    password_confirm: Yup.string()
      .nullable()
      .when('password', {
        is: (val) => Boolean(val),
        then: Yup.string()
          .matches(/^[0-9]+$/, '숫자만 입력 가능합니다.')
          .min(6, '비밀번호는 6자리 이상입니다.')
          .oneOf([Yup.ref('password')], '비밀번호를 확인해주세요.')
          .required('비밀번호 확인은 필수 항목입니다.'),
      }),
  });
  const formik = useFormik({
    initialValues: formValues,
    validationSchema: ProfileSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const variables = {
        memberId: getAuthUser().id,
        name: values.name,
        email: values.email,
      };
      if (values.password) variables['password'] = values.password;
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

  useEffect(() => {
    if (!message.open && isDone) {
      navigate(path.urls.default);
    }
    // eslint-disable-next-line
  }, [message.open, isDone]);

  const handleData = (data) => {
    const newValues = matchFormValues(INIT_VALUES, data);
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

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <MainCard darkTitle title='회원 정보 수정' contentSX={{ maxWidth: 500 }}>
      <FormikProvider value={formik}>
        <Form autoComplete='off' noValidate onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Stack direction={'row'} spacing={1}>
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
                autoComplete='password'
                type={showPassword ? 'text' : 'password'}
                label='비밀번호 확인'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={handleShowPassword} edge='end'>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...getFieldProps('password_confirm')}
                error={Boolean(
                  touched.password_confirm && errors.password_confirm
                )}
                helperText={touched.password_confirm && errors.password_confirm}
              />
            </Stack>
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
