import { forwardRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { replace } from 'lodash';
// material
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  Slide,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
// graphql
import { useMutation, useReactiveVar } from '@apollo/client';
import { PAY_QUERY } from 'graphql/mutation';
// components
import { MainCard } from 'components/ui/cards';
// config
import { CATEGORY_TYPE, LESSON_TYPE, PERIOD_TYPE } from 'config/constants';
import { path } from 'config/path';
// helpers
import { gatAuthApp, getAuthBarcode, getAuthUser } from 'helpers/storage';
import { requestPayment } from 'helpers/payment';
import { storeDataVar } from 'helpers/cache';
// utils
import { fNumber } from 'utils/formatNumber';
import { convertDayCodeToText } from 'utils/util';
import RefundDialog from './RefundDialog';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});
const PaymentDialog = ({ open, setOpen, item }) => {
  const navigate = useNavigate();
  const storeData = useReactiveVar(storeDataVar);
  const matchMD = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const matchXS = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  // data
  const [message, setMessage] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [openRefundDialog, setOpenRefundDialog] = useState(false);
  // graphql
  const [payment] = useMutation(PAY_QUERY, {
    onCompleted: (data) => {
      setOpenDialog(false);
      if (data.clt_payment.status) {
        if (item.category_id === '1') {
          alert('레슨 수강이 완료되었습니다.');
        } else {
          alert('정기권 구매가 완료되었습니다.');
        }
        navigate(path.urls.tickets);
      } else {
        alert('오류가 발생하였습니다. 잠시 후에 다시 사용해 주세요.');
      }
    },
    onError: (error) => console.log(error),
  });

  const handlePay = (paymentData) => {
    const variables = {
      storeId: storeData.id,
      storeName: storeData.name,
      memberId: getAuthUser().id,
      memberName: getAuthUser().name,
      phone: getAuthUser().contact,
      barcode: getAuthBarcode(),
      categoryId: item.category_id,
      category: CATEGORY_TYPE[item.category_id],
      programName: item.name,
      period: item.period,
      periodType: item.period_type,
      price: item.price,
      lessonType: item.lesson_type,
      ...paymentData,
    };

    if (item.category_id === '1') {
      variables.instructorId = item.user_id;
      variables.instructorName = item.user_name;
      variables.dates = JSON.stringify(item.dates);
      variables.lesson = JSON.stringify({
        lesson_id: item.id,
        lesson_day: item.lesson_day,
        lesson_limit: item.lesson_limit,
      });
    }

    payment({ variables });
  };
  const handleClose = () => {
    setMessage();
    setOpen(false);
  };
  const handleClickDialog = () => {
    setOpenRefundDialog(true);
  };

  const handleRequestPayment = async () => {
    if (gatAuthApp()) {
      const response = await requestPayment(item);
      if (response.status) {
        setOpenDialog(true);
        setMessage();
        const data = response.data;
        const cardData = data.card_data;
        const card = {
          termid: cardData.tid,
          cardtype: cardData.card_company,
          cardno: `${cardData.card_no.substring(0, 6)}**********`,
          cardQuota: cardData.card_quota,
          appno: cardData.card_approve_no,
          saledate: format(new Date(), 'yyyyMMdd'),
          saletime: format(new Date(), 'HHmmss'),
          paytype: 1,
          installment: 0,
          cardReceiptUrl: replace(cardData.receipt_url, /\\/g, ''),
          receiptId: data.receipt_id,
          receiptUrl: data.receipt_url,
          receiptStatus: data.status,
          receiptPrice: data.price,
        };
        handlePay(card);
      } else {
        setMessage(response.message);
      }
    }
  };

  return (
    <Dialog
      fullWidth
      fullScreen={matchMD}
      open={open}
      // onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar color='tennis' sx={{ position: 'relative' }}>
        <Toolbar sx={{ py: 2 }}>
          <Typography variant='h3' sx={{ width: '100%', textAlign: 'center' }}>
            결제
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          py: { xs: 1.5, sm: 2.5 },
          px: { xs: 1, sm: 2 },
          backgroundColor: 'primary.light',
          height: '100%',
        }}
      >
        <MainCard
          contentSX={{
            width: matchMD ? (matchXS ? '100%' : 600) : '100%',
            mx: 'auto',
            my: 4,
          }}
        >
          {item && (
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Typography
                  variant='h3'
                  sx={{ fontWeight: 500, color: 'grey.500' }}
                >
                  구매내역
                </Typography>

                <Stack spacing={1}>
                  <Typography variant='h3' sx={{ fontWeight: 500 }}>
                    {CATEGORY_TYPE[item.category_id]}
                  </Typography>
                  <Typography variant='h3' sx={{ fontWeight: 500 }}>
                    {item.name}: {item.period}
                    {PERIOD_TYPE[item.period_type]}
                    {item.dates && ` (${LESSON_TYPE[item.lesson_type]})`}
                  </Typography>
                  {item.dates && (
                    <>
                      <Stack direction='row' spacing={1}>
                        <Typography variant='h3' sx={{ fontWeight: 500 }}>
                          {convertDayCodeToText(item.lesson_day)}
                        </Typography>
                        <Typography variant='h3' sx={{ fontWeight: 500 }}>
                          {item.lesson_time}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1}
                      >
                        <Typography variant='h3' sx={{ fontWeight: 500 }}>
                          레슨 날짜:
                        </Typography>
                        <Typography
                          variant='h3'
                          sx={{ fontWeight: 500, pl: { xs: 3, sm: 0 } }}
                        >
                          {item.dates[0]} ~ {item.dates[item.dates.length - 1]}
                        </Typography>
                      </Stack>
                    </>
                  )}
                </Stack>
              </Stack>
              <Stack
                direction={'row'}
                justifyContent='space-between'
                sx={{ borderTop: 1, pt: 2 }}
              >
                <Typography variant='h3' sx={{ fontWeight: 500 }}>
                  결제금액
                </Typography>
                <Typography variant='h3'>{fNumber(item.price)} 원</Typography>
              </Stack>
            </Stack>
          )}

          <Stack direction='row' sx={{ mt: 4 }}>
            <Typography sx={{ fontSize: 16, pt: 1 }}>
              예약취소 및 환불규정
            </Typography>
            <Button
              variant='outlined'
              color='tennis'
              sx={{
                width: 110,
                height: 36,
                fontSize: 14,
                borderRadius: 4.5,
                pt: 1,
                ml: 1,
              }}
              onClick={handleClickDialog}
            >
              자세히 보기
            </Button>
          </Stack>
          <Typography color={'error'} sx={{ mt: 0.5, minHeight: 19 }}>
            {message}
          </Typography>
          <Stack sx={{ mt: 2 }} spacing={2}>
            <Button
              variant='contained'
              color='tennis'
              sx={{
                fontSize: 20,
                borderRadius: 6,
              }}
              onClick={handleRequestPayment}
            >
              결제하기
            </Button>
            <Button
              variant='outlined'
              color='tennis'
              sx={{
                fontSize: 20,
                borderRadius: 6,
              }}
              onClick={handleClose}
            >
              취소
            </Button>
          </Stack>
        </MainCard>
      </Box>
      <RefundDialog open={openRefundDialog} setOpen={setOpenRefundDialog} />
      <Dialog open={openDialog}>
        <Stack spacing={2} sx={{ p: 4 }}>
          <Stack direction={'row'} spacing={1.5}>
            <CircularProgress color='error' />
            <Typography variant='h3' sx={{ p: 1 }}>
              결제 처리중...
            </Typography>
          </Stack>
          <Typography color={'error'} align='center'>
            잠시만 기다려주세요.
          </Typography>
        </Stack>
      </Dialog>
    </Dialog>
  );
};

export default PaymentDialog;
