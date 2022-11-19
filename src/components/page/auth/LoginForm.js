import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// material
import {
  Alert,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// form
import { useFormik, Form, FormikProvider } from 'formik';
// icon
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
// graphql
import { useMutation } from '@apollo/client';
import { LOGIN_QUERY } from 'graphql/mutation';
// components
import { Store } from 'components/app';
// helper
import { getAuthStore, setAuthData } from 'helpers/storage';
import { storeDataVar } from 'helpers/cache';
// config
import { path } from 'config/path';
import { useEffect } from 'react';

const LoginForm = ({handleStore}) => {
  const navigate = useNavigate();
  const { storeid } = useParams();
  // data
  const [id, setId] = useState();
  const [name, setName] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState();
  const [checked, setChecked] = useState(true);  
  // graphql
  const [login, { loading }] = useMutation(LOGIN_QUERY, {
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
    phone: Yup.string().required('핸드폰 번호를 입력해 주세요.'),
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
    } else setId('4');
  }, [storeid]);

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const handleChangeStore = (storeId, storeName) => {
    setFieldValue('store', storeId);
    setName(storeName);
    if (handleStore) {      
      handleStore(storeId, storeName);
    }
  };

  const { errors, touched, handleSubmit, getFieldProps, setFieldValue } =
    formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete='off' noValidate onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Store
            required
            storeId={id}
            handleStore={handleChangeStore}
            //disabled={!!id}
          />
          <br />
        </Stack>
        {!name ? <Stack spacing={20}><Typography>&nbsp;</Typography> <Typography>&nbsp;</Typography></Stack> :  
        <Stack spacing={2}>
          <TextField
            fullWidth
            autoFocus
            color='tennis'
            autoComplete='phone'
            type='text'
            label='핸드폰 번호 *'
            {...getFieldProps('phone')}
            error={Boolean(touched.phone && errors.phone)}
            // helperText={touched.phone && errors.phone}
          />
          <TextField
            fullWidth
            color='tennis'
            autoComplete='password'
            type={showPassword ? 'text' : 'password'}
            label='비밀번호 *'
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={handleShowPassword} edge='end'>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            // helperText={touched.password && errors.password}
          />
          <FormControlLabel
            control={
              <Checkbox
                color='tennis'
                checked={checked}
                onChange={(event) => setChecked(event.target.checked)}
                sx={{ pl: 0, py: 0 }}
              />
            }
            label='로그인 상태 유지'
          />
          <LoadingButton
            fullWidth
            size='large'
            type='submit'
            color='tennis'
            variant='contained'
            loading={loading}
          >
            로그인
          </LoadingButton>
          {message && <Alert severity='error'>{message}</Alert>}          
        </Stack>}
      </Form>
    </FormikProvider>
  );
};

export default LoginForm;
