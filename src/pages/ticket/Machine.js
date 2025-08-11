import { useEffect, useRef, useState } from 'react';
// material
import { Radio, Stack, Typography } from '@mui/material';
// graphql
import { useLazyQuery } from '@apollo/client';
import { PROGRAMS_QUERY } from 'graphql/query';
// components
import { GreyBox, PageContainer } from 'components/page';
import { TButton } from 'components/ui';
// config
import {
  text12,
  text14,
  text14B,
  text15,
  text15B,
  text18B,
  text24B,
} from 'config/styles';
import { CATEGORIES, PERIOD_TYPE } from 'config/constants';
// utils
import { fNumber } from 'utils/formatNumber';
// pages
import Payment from './Payment';

const Machine = () => {
  const paymentRef = useRef();
  // data
  const [selectedValue, setSelectedValue] = useState();
  const [items, setItems] = useState();
  const [item, setItem] = useState();

  // graphql
  const [getPrograms, { loading, error }] = useLazyQuery(PROGRAMS_QUERY, {
    onCompleted: (data) => {
      if (data.clt_programs) {
        setItems(data.clt_programs);
      }
    },
  });

  useEffect(() => {
    getPrograms({ variables: { categoryId: CATEGORIES[1].value } });
    // eslint-disable-next-line
  }, []);

  if (loading) return <>Loading...</>;
  if (error) return <>ERROR</>;

  const handleTicket = (item) => {
    setSelectedValue(item.id);
    setItem(item);
  };
  const handleNavigate = (path) => {
    if (path === 'payment') paymentRef.current.open();
  };

  return (
    <PageContainer label='시설이용권'>
      <Stack spacing={1}>
        <Stack spacing={1.5}>
          <Typography sx={text15B}>이용권 선택</Typography>
          <Typography sx={{ ...text12, color: 'grey.800' }}>
            모든 시설이용권의 사용기간은 6개월입니다.
          </Typography>
        </Stack>
        <Stack spacing={1}>
          {items &&
            items.map((item, index) => {
              return (
                <GreyBox
                  direction={'row'}
                  spacing={1}
                  alignItems={'flex-start'}
                  sx={{ p: 2, mx: 0 }}
                  onClick={() => handleTicket(item)}
                  key={index}
                >
                  <Radio
                    checked={selectedValue === item.id}
                    name='ticket-buttons'
                    sx={{ p: 0 }}
                  />
                  <Stack spacing={0.5}>
                    <Stack
                      direction={'row'}
                      alignItems={'center'}
                      spacing={0.3}
                    >
                      <Typography sx={text24B}>{item.period}</Typography>
                      <Typography sx={text18B}>
                        {PERIOD_TYPE[item.period_type]}
                      </Typography>
                      {item.period_type === '2' && (
                        <Typography sx={{ ...text15, color: 'grey.800' }}>
                          ({item.period * 60}분)
                        </Typography>
                      )}
                    </Stack>
                    <Typography sx={text14B}>
                      {fNumber(item.price)} 원
                    </Typography>
                  </Stack>
                </GreyBox>
              );
            })}
        </Stack>
      </Stack>
      <Typography
        sx={{ ...text12, color: 'grey.800', mt: 5, textAlign: 'center' }}
      >
        이용권은 앱을 통한 예약과 현장결제시 적용가능합니다.
      </Typography>
      {item && (
        <TicketModal item={item} onClick={() => handleNavigate('payment')} />
      )}
      <Payment ref={paymentRef} item={item} />
    </PageContainer>
  );
};

const TicketModal = ({ item, onClick }) => {
  return (
    <Stack
      spacing={2}
      sx={{
        position: 'fixed',
        bottom: 100,
        left: 0,
        right: 0,
        p: 2,
        bgcolor: 'grey.100',
      }}
    >
      <Typography sx={{ ...text14, textAlign: 'center' }}>
        {item.period}
        {PERIOD_TYPE[item.period_type]} 이용권
      </Typography>
      <TButton label='구매 하기' onClick={onClick} />
    </Stack>
  );
};

export default Machine;
