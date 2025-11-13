import { forwardRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { replace } from 'lodash';
// material
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  CircularProgress,
  Dialog,
  Stack,
  Typography,
} from '@mui/material';
// graphql
import { useMutation, useReactiveVar } from '@apollo/client';
import { PAY_QUERY, BOOK_QUERY } from 'graphql/mutation';
// components
import { DialogContainer, GreyBox } from 'components/page';
import { AlertModal, TButton } from 'components/ui';
// config
import { text12, text14, text14B, text15B } from 'config/styles';
import { CATEGORY_TYPE, PERIOD_TYPE } from 'config/constants';
import { ChevronDownIcon } from 'config/icons';
import { path } from 'config/path';
// helpers
import { gatAuthApp, getAuthBarcode, getAuthUser } from 'helpers/storage';
import { requestPayment } from 'helpers/payment';
import { storeDataVar } from 'helpers/cache';
// utils
import { fNumber } from 'utils/formatNumber';
import { convertDayCodeToText } from 'utils/util';
import { fDateToDot, fHmsToHm } from 'utils/formatDateTime';
// pages
import StoreInfo from 'pages/store/Info';

const Payment = forwardRef(({ item }, ref) => {
  const navigate = useNavigate();
  const storeData = useReactiveVar(storeDataVar);
  // data
  const [checked, setChecked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isGoing, setIsGoing] = useState(false);
  const [isLesson, setIsLesson] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    error: false,
  });

  // graphql
  const [payment] = useMutation(PAY_QUERY, {
    onCompleted: (data) => {
      setOpenDialog(false);
      let message = '오류가 발생하였습니다. 잠시 후에 다시 사용해 주세요.';
      let error = true;
      if (data.clt_payment.status) {
        setIsGoing(true);
        if (item.category_id === '1') {
          message = '레슨 수강이 완료되었습니다.';
        } else {
          //message = '정기권 구매가 완료되었습니다.';
          message = '결제가 완료되었습니다.';
        }
        error = false;
      }
      handleAlert({
        open: true,
        message: message,
        error: error,
      });
    },
    onError: (error) => console.log(error),
  });

  const [booking] = useMutation(BOOK_QUERY, {
      onCompleted: (data) => {
        if (data.clt_booking.status) {
          navigate(path.urls.home);
        } else {
          //setMessage(data.clt_booking.message);
          //setOpenAlert(true);
          handleAlert({
            open: true,
            message: data.clt_booking.message,
            error: true,
          });
        }
      },
      onError: (error) => console.log(error),
    });

  useEffect(() => {
    if (!alert.open && isGoing) {
      if (item.category_id === 3) {      
        const variables = {
          storeId: item.storeId,
          machineId: item.machineId,
          memberId: item.memberId,
          barcode: item.barcode,
          discount: item.discount,
          times: item.times,
          startDate: item.startDate,
          startTime: item.startTime,
          endDate: item.endDate,
          endTime: item.endTime,
          usedTime: item.usedTime,
        };
        booking({ variables });
      } else {
        navigate(path.urls.home);
      }
    }
  }, [alert.open]);

  useEffect(() => {
    if (item) {
      setIsLesson(item.category_id === '1');
    }
  }, [item]);

  const handlePayment = async () => {
    console.log('handlePayment item', item);
    if (gatAuthApp() && item) {
      const response = await requestPayment(item);
      if (response.status) {
        setOpenDialog(true);
        //console.log(response);
        const data = response.data;
        if (data.card_data) {
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
        }
        else {
          console.log(data);
          const card = {
            termid: data.kakao_money_data ? data.kakao_money_data.tid : '0000',
            cardtype: data.method_origin,
            cardno: '',
            cardQuota: '0',
            appno: data.order_id,
            saledate: format(new Date(), 'yyyyMMdd'),
            saletime: format(new Date(), 'HHmmss'),
            paytype: 1,
            installment: 0,
            cardReceiptUrl: '',
            receiptId: data.receipt_id,
            receiptUrl: data.receipt_url,
            receiptStatus: data.status,
            receiptPrice: data.price,
          };
          handlePay(card);
        }
      } else {
        handleAlert({ open: true, message: response.message, error: true });
      }
    }
  };
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
      period: String(item.period),
      periodType: String(item.period_type),
      price: String(item.price),
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
  const handleChange = () => {
    setChecked(!checked);
  };
  const handleAccordion = () => {
    setExpanded((prev) => !prev);
  };
  const handleAlert = (alert) => {
    setAlert((prev) => {
      return {
        ...prev,
        ...alert,
      };
    });
  };

  return (
    <DialogContainer ref={ref} title='결제하기' isFooter={false}>
      <Stack spacing={2} sx={{ pb: 2 }}>
        <Typography sx={text15B}>
          {item && CATEGORY_TYPE[item.category_id]}
        </Typography>
        <Stack direction={'row'} spacing={1}>
          {isLesson && (
            <Typography sx={text14B}>
              {/* {item && convertDayCodeToText(item.lesson_day)}요일 */}
              {item && item.name }
            </Typography>
          )}
          <Typography sx={text14B}>
            {item && `${item.period}${PERIOD_TYPE[item.period_type]}`}
          </Typography>
          {/* {isLesson && (
            <Stack direction={'row'} spacing={0.5}>
              <Typography sx={text14B}>{item && item.time}분</Typography>
              <Typography sx={text14}>
                {item && fHmsToHm(item.lesson_start_time)}-
                {item && fHmsToHm(item.lesson_end_time)}
              </Typography>
            </Stack>
          )} */}
        </Stack>
        {/* {isLesson && (
          <Stack direction={'row'} spacing={0.5}>
            <Typography sx={text14B}>레슨 날짜</Typography>
            <Typography sx={text14}>
              {item &&
                `${fDateToDot(item.dates[0])} - ${fDateToDot(
                  item.dates[item.dates.length - 1]
                )}`}
            </Typography>
          </Stack>
        )} */}
      </Stack>
      <GreyBox sx={{ height: 8 }} />
      <Stack spacing={2} sx={{ py: 2 }}>
        <Typography sx={text15B}>결제금액</Typography>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography sx={text14}>
            {item && CATEGORY_TYPE[item.category_id]} 금액
          </Typography>
          <Typography sx={text14B}>{item && fNumber(item.price)} 원</Typography>
        </Stack>
      </Stack>
      <GreyBox sx={{ height: 8 }} />
      <Accordion
        expanded={expanded}
        sx={{
          mx: -2,
          '&:before': { display: 'none' },
          '&.Mui-expanded': { m: '12px -16px' },
        }}
      >
        <AccordionSummary
          expandIcon={
            <ChevronDownIcon
              sx={{ width: 7.4, height: 12 }}
              onClick={handleAccordion}
            />
          }
          sx={{
            '&.Mui-expanded': { minHeight: 24 },
            '& .MuiAccordionSummary-content.Mui-expanded': { m: 0, p: 0 },
          }}
        >
          <Stack
            direction={'row'}
            spacing={0.3}
            alignItems={'center'}
            onClick={handleChange}
          >
            <Checkbox
              checked={checked}
              color='black'
              sx={{
                p: 0,
                color: 'tennis.main',
                '&.Mui-checked': {
                  color: 'tennis.main',
                },
              }}
            />
            <Typography sx={text14}>주문내용 확인 및 결제 동의</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={text12}>
            스크린 테니스 예약 취소 및 환불규정
          </Typography>
          <Typography sx={{ ...text12, mt: 0.5 }}>
            예약시간 기준 6시간 전 : 전액 환불
          </Typography>
        </AccordionDetails>
      </Accordion>
      <GreyBox sx={{ height: 8 }} />
      <StoreInfo />
      <PaymentButton
        price={item && item.price}
        disabled={!checked}
        onClick={handlePayment}
      />
      <AlertModal
        open={alert.open}
        alert={alert.message}
        error={alert.error}
        align='center'
        onClick={() => handleAlert({ open: false })}
      />
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
    </DialogContainer>
  );
});

const PaymentButton = ({ price, disabled, onClick }) => {
  return (
    <GreyBox
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        p: 2,
        mx: 0,
      }}
    >
      <TButton
        label={`${fNumber(price)}원 결제하기`}
        disabled={disabled}
        onClick={onClick}
      />
    </GreyBox>
  );
};

export default Payment;
