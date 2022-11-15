import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
// material
import { Box, Divider, Stack, Typography } from '@mui/material';
// config
import { PAY_TO, PAY_TYPE, PERIOD_TYPE } from 'config/constants';
// utils
import { fDateIE } from 'utils/formatDateTime';
import { fNumber } from 'utils/formatNumber';

const PaymentMobile = ({ data, currentPage, handleScroll }) => {
  // data
  const [payments, setPayments] = useState();

  useEffect(() => {
    if (data) {
      setPayments(data);
    }
  }, [data]);

  return (
    <InfiniteScroll
      pageStart={currentPage - 1}
      loadMore={handleScroll}
      hasMore={true || false}
      initialLoad={false}
    >
      <Stack spacing={2}>
        {payments &&
          payments.map((payment, index) => {
            const period_text = `${payment.period} ${
              PERIOD_TYPE[payment.period_type]
            }`;
            const paytype_text = PAY_TYPE[payment.paytype] || '';
            const payto_text = `(${PAY_TO[payment.payto]})` || '';
            return (
              <Box key={index}>
                <Stack spacing={1}>
                  <Stack direction={'row'} justifyContent='space-between'>
                    <Typography variant='h4'>{payment.category}</Typography>
                    <Typography variant='h5'>
                      {fDateIE(payment.created)}
                    </Typography>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography>{payment.program_name}:</Typography>
                    <Typography>{period_text}</Typography>
                    <Typography>{`${fNumber(payment.price)} 원`}</Typography>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography>{paytype_text}</Typography>
                    <Typography>{payto_text}</Typography>
                  </Stack>
                </Stack>
                <Divider />
              </Box>
            );
          })}
      </Stack>
    </InfiniteScroll>
  );
};

export default PaymentMobile;
