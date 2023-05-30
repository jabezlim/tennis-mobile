import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// material
import { Dialog, Stack, Typography } from '@mui/material';
// form
import { useFormik, Form, FormikProvider } from 'formik';
// graphql
import { useMutation } from '@apollo/client';
import { CONFIRM_CODE_QUERY, PASSWORD_INQUIRY_QUERY } from 'graphql/mutation';
// components
import { ConfirmCode, Store } from 'components/app';
import { AlertModal, FormField, TButton } from 'components/ui';
// config
import { path } from 'config/path';
import { text12 } from 'config/styles';

const INIT_VALUES = {
  store: '',
  phone: '',
};
const Password = () => {
  const navigate = useNavigate();
  const { storeid, storename } = useParams();
  // data
  const [id, setId] = useState();
  const [openCode, setOpenCode] = useState(false);
  const [message, setMessage] = useState();
  const [openAlert, setOpenAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState();
  const [errorAlert, setErrorAlert] = useState(false);

  // graphql
  const [getConfirmCode] = useMutation(CONFIRM_CODE_QUERY, {
    onCompleted: (data) => {
      if (data.clt_confirmcode.status) {
        setOpenCode(true);
      } else {
        setMessage(data.clt_confirmcode.message);
      }
    },
    onError: (error) => console.log(error),
  });
  const [passwordInquiry] = useMutation(PASSWORD_INQUIRY_QUERY, {
    onCompleted: (data) => {
      if (data.clt_password.status) {
        setMessageAlert(
          '새로운 비밀번호가 입력하신 전화번호로 발송되었습니다. 로그인 후 ‘마이페이지’에서 원하는 비밀번호로 재설정 할 수 있습니다. 로그인 페이지로 이동합니다.'
        );
        setErrorAlert(false);
      } else {
        setMessageAlert(data.clt_password.message);
        setErrorAlert(true);
      }
      setOpenAlert(true);
    },
    onError: (error) => console.log(error),
  });

  const PasswordSchema = Yup.object().shape({
    phone: Yup.number()
      .typeError('핸드폰 번호는 숫자만 입력해 주세요')
      .required('핸드폰 번호를 입력해 주세요.'),
  });
  const formik = useFormik({
    initialValues: INIT_VALUES,
    validationSchema: PasswordSchema,
    onSubmit: (values) => {
      setMessage();
      const variables = {
        store: parseInt(values.store),
        phone: values.phone,
        isMember: true,
      };
      getConfirmCode({ variables });
    },
  });

  useEffect(() => {
    if (storeid) {
      setId(storeid);
      setFieldValue('store', storeid);
    }
    // eslint-disable-next-line
  }, [storeid, storename]);

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
  const handleCode = (code) => {
    const variables = {
      store: id,
      phone: getFieldProps('phone').value,
      code: code,
    };
    passwordInquiry({ variables });
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
              비밀번호 찾기
            </Typography>

            {storename && <Typography>지점명 : {storename}</Typography>}
            {!storename && (
              <Store
                required
                storeId={id}
                handleStore={handleChangeStore}
                disabled={!!storeid}
              />
            )}
            <FormField
              autoFocus={storename ? true : false}
              label='핸드폰 번호'
              {...getFieldProps('phone')}
              placeholder='-없이 숫자만 입력해 주세요.'
              error={Boolean(touched.phone && errors.phone)}
              // helperText={touched.phone && errors.phone}
            />
            <Typography color={'error'} sx={{ ...text12, pb: 5.5 }}>
              {message}
            </Typography>

            <TButton label='다음' onClick={handleSubmit} />
            <TButton
              variant='outlined'
              label='로그인 화면으로'
              onClick={handleLogin}
            />
          </Stack>
        </Form>
      </FormikProvider>
      <Dialog fullScreen open={openCode}>
        <ConfirmCode
          store={id}
          phone={getFieldProps('phone').value}
          time={openCode ? 600 : null}
          label='새로운 비밀번호 받기'
          handleCode={handleCode}
        />
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

export default Password;
