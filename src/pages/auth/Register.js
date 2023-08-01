import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// material
import {
  Checkbox,
  Dialog,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material';
// form
import { useFormik, Form, FormikProvider } from 'formik';
// graphql
import { useMutation } from '@apollo/client';
import { REGISTER_CONFIRM_QUERY, REGISTER_QUERY } from 'graphql/mutation';
// components
import { ConfirmCode, Store } from 'components/app';
import { AlertModal, FormField, TButton } from 'components/ui';
import { Terms } from 'components/page/auth';
// config
import { path } from 'config/path';
import { text11, text12, text18 } from 'config/styles';
import { ArrowBackIcon, CheckIcon, ChevronRightIcon } from 'config/icons';
import { ICON_COLOR_CSS } from 'config/constants';

const Register = () => {
  const navigate = useNavigate();
  const { storeid } = useParams();
  // data
  const [id, setId] = useState();
  const [checked, setChecked] = useState(true);
  const [openTerm, setOpenTerm] = useState(false);
  const [openCode, setOpenCode] = useState(false);
  const [message, setMessage] = useState();
  const [openAlert, setOpenAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState();
  const [errorAlert, setErrorAlert] = useState(false);

  // graphql
  const [registerConfirm] = useMutation(REGISTER_CONFIRM_QUERY, {
    onCompleted: (data) => {
      if (data.clt_register_confirm.status) {
        setOpenCode(true);
      } else {
        setMessage(data.clt_register_confirm.message);
      }
    },
    onError: (error) => console.log(error),
  });
  const [register] = useMutation(REGISTER_QUERY, {
    onCompleted: (data) => {
      if (data.clt_register.status) {
        setMessageAlert(
          '회원 가입이 완료되었습니다. 로그인 페이지로 이동합니다.'
        );
        setErrorAlert(false);
      } else {
        setMessageAlert(data.clt_register.message);
        setErrorAlert(true);
      }
      setOpenAlert(true);
    },
    onError: (error) => console.log(error),
  });

  const RegisterSchema = Yup.object().shape({
    phone: Yup.number()
      .typeError('핸드폰 번호는 숫자만 입력해 주세요')
      .required('핸드폰 번호를 입력해 주세요.'),
    password: Yup.string()
      .matches(/^[0-9]+$/, '숫자만 입력 가능합니다.')
      .min(6, '비밀번호는 6자리 이상입니다.')
      .required('비밀번호를 입력해 주세요.'),
  });
  const formik = useFormik({
    initialValues: { store: '', phone: '', password: '' },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      registerConfirm({
        variables: {
          storeId: values.store,
          phone: values.phone,
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

  const handleChangeStore = (storeId) => {
    setId(storeId);
    setFieldValue('store', storeId);
  };
  const handleLogin = () => {
    if (errorAlert) {
      setOpenCode(false);
      setOpenAlert(false);
    } else {
      const url = id ? `${path.urls.login}/${id}` : path.urls.login;
      navigate(url);
    }
  };
  const handleTerm = () => {
    setChecked(true);
    handleClose();
  };
  const handleClose = () => {
    setOpenTerm(false);
  };
  const handleCode = (code) => {
    const variables = {
      storeId: id,
      phone: getFieldProps('phone').value,
      code: code,
    };
    register({ variables });
  };

  const { errors, touched, handleSubmit, getFieldProps, setFieldValue } =
    formik;

  return (
    <>
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
              회원가입
            </Typography>
            <Store required storeId={id} handleStore={handleChangeStore} />
            <FormField
              label='핸드폰 번호'
              {...getFieldProps('phone')}
              placeholder='-없이 숫자만 입력해 주세요.'
              error={Boolean(touched.phone && errors.phone)}
              // helperText={touched.phone && errors.phone}
            />
            <Stack spacing={1}>
              <FormField
                type='password'
                label='비밀번호 설정'
                {...getFieldProps('password')}
                placeholder='비밀번호를 설정해 주세요.'
                error={Boolean(touched.password && errors.password)}
                // helperText={touched.password && errors.password}
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
              <Typography color={'error'} sx={{ ...text12, pb: 5.5 }}>
                {message}
              </Typography>
            </Stack>
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
                label='개인정보 수집 동의'
                sx={{
                  '& 	.MuiFormControlLabel-label': { mt: 0.4, ...text12 },
                }}
              />
              <Stack direction={'row'} onClick={() => setOpenTerm(true)}>
                <Typography sx={{ mt: 0.9, ...text12 }}>전체 보기</Typography>
                <ChevronRightIcon
                  sx={{ width: 5.48, height: 9.42, mt: 0.9, ml: 1 }}
                />
              </Stack>
            </Stack>
            <TButton label='회원가입' onClick={handleSubmit} />
            <TButton
              variant='outlined'
              label='로그인 화면으로'
              onClick={handleLogin}
            />
          </Stack>
        </Form>
      </FormikProvider>
      <Dialog fullScreen open={openCode} onClose={() => setOpenCode(false)}>
        <ConfirmCode
          store={id}
          phone={getFieldProps('phone').value}
          time={openCode ? 600 : null}
          handleCode={handleCode}
        />
      </Dialog>
      <Dialog fullScreen open={openTerm}>
        <Stack spacing={3}>
          <Stack
            direction={'row'}
            spacing={1}
            sx={{
              height: 54,
              mt: 4,
              p: 2,
              borderBottom: 1,
              borderColor: '#E0E0E0',
            }}
          >
            <ArrowBackIcon onClick={handleClose} />
            <Typography sx={{ ...text18, fontWeight: 700 }}>
              개인정보 수집, 이용 동의서
            </Typography>
          </Stack>
          <Terms />
          <Stack sx={{ px: 2 }}>
            <TButton label='동의하기' onClick={handleTerm} sx={{ mt: -3 }} />
          </Stack>
        </Stack>
      </Dialog>
      <AlertModal
        open={openAlert}
        error={errorAlert}
        alert={messageAlert}
        onClick={handleLogin}
      />
    </>
  );
};

export default Register;
