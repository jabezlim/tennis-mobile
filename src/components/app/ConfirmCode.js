import * as Yup from 'yup';
import { useEffect, useRef, useState } from 'react';
// material
import { Stack, TextField, Typography } from '@mui/material';
// form
import { useFormik, Form, FormikProvider } from 'formik';
// graphql
import { useMutation } from '@apollo/client';
import { CONFIRM_CODE_QUERY } from 'graphql/mutation';
// components
import { TButton } from 'components/ui';
import { MessageAlert } from 'components/ui/snackbar';
// config
import { text11, text12 } from 'config/styles';
// utils
import { convertSecondsToFormat } from 'utils/formatDateTime';
// hooks
import { useInterval } from 'hooks';

const INIT_VALUES = {
  phone_1: '',
  phone_2: '',
  phone_3: '',
  phone_4: '',
  phone_5: '',
  phone_6: '',
};
const ConfirmCode = ({
  store,
  phone,
  time,
  label = '인증하기',
  handleCode,
}) => {
  const alertRef = useRef();
  // data
  const [count, setCount] = useState(0);
  // const [showCount, setShowCount] = useState(0);
  const [message, setMessage] = useState();

  // graphql
  const [getConfirmCode] = useMutation(CONFIRM_CODE_QUERY, {
    onCompleted: (data) => {
      if (data.clt_confirmcode.status) {
        setCount(600);
        alertRef.current.open();
        // setShowCount(3);
      }
    },
    onError: (error) => console.log(error),
  });

  const ConfirmSchema = Yup.object().shape({
    phone_1: Yup.string().required('인증코드를 입력하세요.'),
    phone_2: Yup.string().required('인증코드를 입력하세요.'),
    phone_3: Yup.string().required('인증코드를 입력하세요.'),
    phone_4: Yup.string().required('인증코드를 입력하세요.'),
    phone_5: Yup.string().required('인증코드를 입력하세요.'),
    phone_6: Yup.string().required('인증코드를 입력하세요.'),
  });
  const formik = useFormik({
    initialValues: INIT_VALUES,
    validationSchema: ConfirmSchema,
    onSubmit: (values) => {
      const code =
        values.phone_1 +
        values.phone_2 +
        values.phone_3 +
        values.phone_4 +
        values.phone_5 +
        values.phone_6;
      handleCode(code);
    },
  });

  useEffect(() => {
    if (time) {
      setCount(time);
    }
  }, [time]);

  useInterval(
    () => {
      setCount((prevData) => {
        return prevData - 1;
      });
    },
    count === 0 ? null : 1000
  );

  // useInterval(
  //   () => {
  //     setShowCount((prevData) => {
  //       return prevData - 1;
  //     });
  //   },
  //   showCount === 0 ? null : 1000
  // );

  const handleChange = (e) => {
    const { maxLength, value, id } = e.target;
    const code = Number(id.replace('code_', ''));

    setFieldValue(`phone_${code}`, value);

    if (value.length >= maxLength && code < 6) {
      const nextSibling = document.querySelector(`input[id=code_${code + 1}]`);
      if (nextSibling !== null) {
        nextSibling.focus();
      }
    }
  };
  const handleResendCode = () => {
    if (store && phone) {
      const variables = {
        store: store,
        phone: phone,
        isMember: true,
      };
      setMessage();
      getConfirmCode({ variables });
    }
  };

  const { errors, touched, handleSubmit, setFieldValue } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete='off' noValidate>
        <Stack spacing={1.65} sx={{ px: 2, py: 0.5 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 32,
              lineHeight: '32px',
              mt: 15,
              mb: 0.4,
            }}
          >
            인증코드 입력
          </Typography>

          <Stack spacing={1} sx={{ pb: 5 }}>
            <Typography sx={text12}>
              인증코드가 입력하신 전화번호로 발송되었습니다.
            </Typography>
            <Typography sx={text12}>
              10분 이내로 인증을 완료해주세요.
            </Typography>
          </Stack>

          <Stack spacing={1} sx={{ pb: 11 }}>
            <Stack direction='row' spacing={1.5}>
              {[1, 2, 3, 4, 5, 6].map((number) => (
                <ConfirmText
                  key={number}
                  id={number}
                  error={Boolean(
                    touched[`phone_${number}`] && errors[`phone_${number}`]
                  )}
                  handleChange={handleChange}
                />
              ))}
            </Stack>
            <Stack direction={'row'} justifyContent={'space-between'}>
              <Typography sx={text12}>
                {count > 0 && convertSecondsToFormat(count)}
              </Typography>
              {message && (
                <Typography color={'error'} sx={{ fontWeight: 500, ...text12 }}>
                  {message}
                </Typography>
              )}
            </Stack>
          </Stack>

          <Stack direction={'row'} justifyContent={'space-between'}>
            <Typography sx={text11}>인증 코드를 받지 못하셨나요?</Typography>
            <Typography
              color={'error'}
              sx={{ fontWeight: 500, ...text11 }}
              onClick={handleResendCode}
            >
              인증 코드 다시 받기
            </Typography>
          </Stack>
          <TButton label={label} onClick={handleSubmit} />
          <MessageAlert
            ref={alertRef}
            message='인증코드가 재전송 되었습니다.'
          />
          {/* {showCount > 0 && (
            <Stack sx={{ pt: 10 }}>
              <TButton
                label='인증코드가 재전송 되었습니다.'
                sx={{ opacity: 0.8 }}
              />
            </Stack>
          )} */}
        </Stack>
      </Form>
    </FormikProvider>
  );
};

const ConfirmText = ({ id, error = false, handleChange }) => {
  return (
    <TextField
      fullWidth
      autoFocus={id === 1 ? true : false}
      type='text'
      variant='outlined'
      color='black'
      id={`code_${id}`}
      error={error}
      sx={{
        '& fieldset': {
          borderRadius: 0,
          borderWidth: 0,
        },
        '& .Mui-error fieldset': {
          borderWidth: 2,
        },
      }}
      inputProps={{
        maxLength: 1,
        sx: {
          height: '1.215em',
          textAlign: 'center',
          borderRadius: 0,
          backgroundColor: 'grey.100',
        },
      }}
      onChange={handleChange}
      onFocus={(e) => e.target.select()}
    />
  );
};

export default ConfirmCode;
