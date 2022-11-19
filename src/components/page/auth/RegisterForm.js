import * as Yup from 'yup';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// material
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
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
import { Icon } from '@iconify/react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import open24Filled from '@iconify/icons-fluent/open-24-filled';
// graphql
import { useMutation } from '@apollo/client';
import { REGISTER_QUERY } from 'graphql/mutation';
// context
import { useGlobalContext } from 'context';
// component
import { FadeModal } from 'components/ui/modal';
import { ConfirmCode, Store } from 'components/app';
// config
import { path } from 'config/path';
// hooks
import { useInterval } from 'hooks';
import KioskTerms from './Terms';

const INIT_VALUES = {
  name: '',
  phone: '',
  password: '',
  terms: false,
};
const RegisterForm = ({storeName}) => {
  const navigate = useNavigate();
  const { storeid } = useParams();
  const phoneRef = useRef();
  const { message, settingMessage } = useGlobalContext();
  // data
  const [id, setId] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [codeCount, setCodeCount] = useState(0);
  const [confirmCode, setConfirmCode] = useState();
  // graphql
  const [register, { loading }] = useMutation(REGISTER_QUERY, {
    onCompleted: (data) => {
      if (data.clt_register.status) {
        setCount(2);
        settingMessage('open', true);
        settingMessage(
          'message',
          '회원 가입이 완료되었습니다. 로그인 페이지로 이동합니다.'
        );
      } else {
        setCount(0);
        settingMessage('open', true);
        settingMessage('message', data.clt_register.message);
      }
    },
    onError: (error) => console.log(error),
  });

  const RegisterSchema = Yup.object().shape({
    phone: Yup.number()
      .typeError('핸드폰 번호는 숫자만 입력해 주세요')
      .required('required'),
    password: Yup.string()
      .matches(/^[0-9]+$/, '숫자만 입력 가능합니다.')
      .min(6, '비밀번호는 6자리 이상입니다.')
      .required('비밀번호를 입력해 주세요.'),
    // code: Yup.string().length(6).required('인증코드를 입력해 주세요.'),
    terms: Yup.boolean().oneOf([true], '개인정보 동의가 필요합니다.'),
  });
  const formik = useFormik({
    initialValues: INIT_VALUES,
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      if (confirmCode && confirmCode.length === 6) {
        register({
          variables: {
            storeId: parseInt(id),
            phone: values.phone,
            password: values.password,
            code: confirmCode,
          },
        });
      }
    },
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
      setCodeCount((prevData) => {
        return prevData - 1;
      });
    },
    codeCount === 0 ? null : 1000
  );

  useEffect(() => {
    if (count === 0 && message.open) {
      settingMessage('open', false);
      navigate(id ? `${path.urls.login}/${id}` : path.urls.login);
    }
    // eslint-disable-next-line
  }, [count]);

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const handleClickConfirm = (type) => {
    if (type === 'cancel') setFieldValue('terms', false);
    else setFieldValue('terms', true);
    setOpen(false);
  };
  const handleCheckbox = (event) => {
    setFieldValue('terms', event.target.checked);
  };
  const handleConfirmCode = (type) => {
    if (type === 'check_phone') phoneRef.current.focus();
  };
  const handleChangeStore = (storeId) => {
    setFieldValue('store', storeId);
  };

  const { errors, touched, handleSubmit, getFieldProps, setFieldValue } =
    formik;

  useEffect(() => {
    if (storeid) {
      setId(storeid);
    } else setId('4');
  }, [storeid]);

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete='off' noValidate onSubmit={handleSubmit}>
          <Stack spacing={2}>    
            {        
              storeName ? <Typography>지점명 : {storeName}</Typography> 
              : <Store required storeId={id} handleStore={handleChangeStore} disabled={true} />
            }
            <TextField
              fullWidth
              color='tennis'
              autoComplete='phone'
              type='text'
              inputRef={phoneRef}
              label='핸드폰 번호 *'
              {...getFieldProps('phone')}
              error={Boolean(touched.phone && errors.phone)}
              helperText={
                touched.phone && errors.phone !== 'required' && errors.phone
              }
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
              helperText={touched.password && errors.password}
            />
            <ConfirmCode
              store={storeid}
              phone={getFieldProps('phone').value}
              setConfirmCode={setConfirmCode}
              handleConfirm={handleConfirmCode}
            />
            <Stack>
              <Stack direction='row'>
                <FormControlLabel
                  control={
                    <Checkbox
                      color='tennis'
                      checked={getFieldProps('terms').value}
                      onChange={handleCheckbox}
                      sx={{ py: 0 }}
                    />
                  }
                  label='개인정보 동의'
                />
                <Button variant='text' onClick={() => setOpen(true)}>
                  내용 보기
                  <Icon icon={open24Filled} />
                </Button>
              </Stack>
              <FormHelperText
                error={Boolean(touched.terms && errors.terms)}
                sx={{ height: 19, pl: 4, mt: -0.5 }}
              >
                {touched.terms && errors.terms}
              </FormHelperText>
            </Stack>
            <LoadingButton
              fullWidth
              size='large'
              type='submit'
              color='tennis'
              variant='contained'
              loading={loading}
            >
              회원가입
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>
      <FadeModal open={open} maxWidth={750}>
        <KioskTerms />
        <Stack direction='row' spacing={2}>
          <Button
            fullWidth
            variant='contained'
            color='error'
            onClick={() => handleClickConfirm('cancel')}
          >
            취소
          </Button>
          <Button
            fullWidth
            variant='contained'
            color='tennis'
            onClick={() => handleClickConfirm('confirm')}
          >
            동의하기
          </Button>
        </Stack>
      </FadeModal>
    </>
  );
};

export default RegisterForm;
