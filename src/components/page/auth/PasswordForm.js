import * as Yup from 'yup';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// material
import { Stack, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// form
import { useFormik, Form, FormikProvider } from 'formik';
// graphql
import { useMutation } from '@apollo/client';
import { PASSWORD_INQUIRY_QUERY } from 'graphql/mutation';
// component
import { Store } from 'components/app';
import { ConfirmCode } from 'components/app';
import { FadeModal } from 'components/ui/modal';
// config
import { path } from 'config/path';
// hooks
import { useInterval } from 'hooks';

const INIT_VALUES = {
  store: '',
  name: '',
  phone: '',
  password: '',
  terms: false,
};
const PasswordForm = () => {
  const navigate = useNavigate();
  const phoneRef = useRef();
  const { storeid } = useParams();
  // data
  const [id, setId] = useState();
  const [message, setMessage] = useState();
  const [openMessage, setOpenMessage] = useState(false);
  const [count, setCount] = useState(0);
  const [codeCount, setCodeCount] = useState(0);
  const [confirmCode, setConfirmCode] = useState();
  // graphql
  const [passwordInquiry, { loading }] = useMutation(PASSWORD_INQUIRY_QUERY, {
    onCompleted: (data) => {
      if (data.clt_password.status) {
        setCount(2);
        setMessage(
          '새로운 비밀번호가 전송되었습니다. 로그인 페이지로 이동합니다.'
        );
        setOpenMessage(true);
      } else {
        setCount(0);
        setMessage(data.clt_password.message);
        setOpenMessage(true);
      }
    },
    onError: (error) => console.log(error),
  });

  const PasswordSchema = Yup.object().shape({
    phone: Yup.number()
      .typeError('핸드폰 번호는 숫자만 입력해 주세요')
      .required('required'),
  });
  const formik = useFormik({
    initialValues: INIT_VALUES,
    validationSchema: PasswordSchema,
    onSubmit: (values) => {
      if (confirmCode && confirmCode.length === 6) {
        passwordInquiry({
          variables: {
            store: values.store,
            phone: values.phone,
            code: confirmCode,
          },
        });
      } else {
        setMessage('인증코드 (6자리)를 확인 하세요.');
        setOpenMessage(true);
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
    if (!openMessage) setMessage();
  }, [openMessage]);

  useEffect(() => {
    if (count === 0 && openMessage) {
      navigate(path.urls.login);
    }
    // eslint-disable-next-line
  }, [count]);

  useEffect(() => {
    if (storeid) {
      setId(storeid);
    } else setId('4');
  }, [storeid]);

  const handleConfirmCode = (type) => {
    if (type === 'check_phone') phoneRef.current.focus();
  };
  const handleChangeStore = (storeId) => {
    setFieldValue('store', storeId);
  };

  const { errors, touched, handleSubmit, getFieldProps, setFieldValue } =
    formik;

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete='off' noValidate onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Store required storeId={id} handleStore={handleChangeStore} />
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
            <ConfirmCode
              store={getFieldProps('store').value}
              phone={getFieldProps('phone').value}
              isMember={true}
              setConfirmCode={setConfirmCode}
              handleConfirm={handleConfirmCode}
            />
            <LoadingButton
              fullWidth
              size='large'
              type='submit'
              color='tennis'
              variant='contained'
              loading={loading}
            >
              새로운 비밀번호 받기
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>
      <FadeModal closeBtn open={openMessage} setOpen={setOpenMessage}>
        <Typography variant='h4' sx={{ py: 2 }}>
          {message}
        </Typography>
      </FadeModal>
    </>
  );
};

export default PasswordForm;
