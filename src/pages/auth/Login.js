import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
// material
import { Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';
// form
import { useFormik, Form, FormikProvider } from 'formik';
// graphql
import { useMutation } from '@apollo/client';
import { LOGIN_QUERY } from 'graphql/mutation';
// components
import { Store } from 'components/app';
import { FormField, TButton } from 'components/ui';
// helper
import { getAuthStore, setAuthData } from 'helpers/storage';
import { storeDataVar } from 'helpers/cache';
// config
import { path } from 'config/path';
import { text12 } from 'config/styles';

const Login = () => {
  const navigate = useNavigate();
  const { storeid } = useParams();
  // data
  const [id, setId] = useState();
  const [name, setName] = useState();
  const [checked, setChecked] = useState(true);
  const [message, setMessage] = useState();
  // graphql
  const [login] = useMutation(LOGIN_QUERY, {
    onCompleted: (data) => {
      if (data.clt_auth.status) {
        const authData = { remember: checked, ...data.clt_auth };
        setAuthData(authData);
        storeDataVar(getAuthStore());
        navigate(path.urls.default);
      } else {
        setMessage(data.clt_auth.message);
      }
    },
    onError: (error) => console.log(error),
  });

  const LoginSchema = Yup.object().shape({
    phone: Yup.number()
      .typeError('핸드폰 번호는 숫자만 입력해 주세요')
      .required('핸드폰 번호를 입력해 주세요.'),
    password: Yup.string().required('비밀번호를 입력해 주세요.'),
  });
  const formik = useFormik({
    initialValues: { store: '', phone: '', password: '' },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      login({
        variables: {
          storeId: values.store,
          userId: values.phone,
          password: values.password,
        },
      });
    },
  });

  useEffect(() => {
    if (storeid) {
      setId(storeid);
    }
  }, [storeid]);

  const handleChangeStore = (storeId, storeName) => {
    setId(storeId);
    setName(storeName);
    setFieldValue('store', storeId);
  };

  const handleRegister = () => {
    const url = id ? `${path.urls.register}/${id}/${name}` : path.urls.register;
    navigate(url);
  };

  const { errors, touched, handleSubmit, getFieldProps, setFieldValue } =
    formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete='off' noValidate>
        <Stack spacing={1.65} sx={{ px: 2, py: 0.5 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 32,
              lineHeight: '32px',
              mt: 14,
              mb: 5,
            }}
          >
            로그인
          </Typography>
          <Store required storeId={id} handleStore={handleChangeStore} />
          <FormField
            autoFocus
            label='핸드폰 번호'
            {...getFieldProps('phone')}
            placeholder='-없이 숫자만 입력해 주세요.'
            error={Boolean(touched.phone && errors.phone)}
            // helperText={touched.phone && errors.phone}
          />
          <FormField
            type='password'
            label='비밀번호'
            {...getFieldProps('password')}
            placeholder='비밀번호를 입력해 주세요'
            error={Boolean(touched.password && errors.password)}
            // helperText={touched.password && errors.password}
          />
          <Typography color={'error'} sx={{ ...text12, pb: 5.5 }}>
            {message}
          </Typography>
          <Stack justifyContent='space-between' direction='row'>
            <FormControlLabel
              control={
                <Checkbox
                  color='black'
                  checked={checked}
                  onChange={(event) => setChecked(event.target.checked)}
                  sx={{
                    pr: 0.5,
                    py: 0,
                    color: 'tennis.main',
                    '&.Mui-checked': {
                      color: 'tennis.main',
                    },
                  }}
                />
              }
              label='로그인 상태 유지'
              sx={{
                '& 	.MuiFormControlLabel-label': {
                  mt: 0.4,
                  ...text12,
                },
              }}
            />
            <Typography
              component={Link}
              to={
                id
                  ? `${path.urls.pwInquiry}/${id}/${name}`
                  : path.urls.pwInquiry
              }
              sx={{
                textDecoration: 'none',
                mt: 0.9,
                ...text12,
              }}
            >
              비밀번호 찾기
            </Typography>
          </Stack>
          <TButton label='로그인' onClick={handleSubmit} />
          <TButton
            variant='outlined'
            label='회원가입'
            onClick={handleRegister}
          />
        </Stack>
      </Form>
    </FormikProvider>
  );
};

export default Login;
