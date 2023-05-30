import { useEffect, useRef, useState } from 'react';
import { differenceInMinutes, parseISO } from 'date-fns';
// material
import { Box, Stack, Typography } from '@mui/material';
// graphql
import { useLazyQuery } from '@apollo/client';
import { PROGRAMS_QUERY } from 'graphql/query';
// components
// import { CalendarForm } from 'components/app';
import { GreyBox, PageContainer } from 'components/page';
import { TButton } from 'components/ui';
// config
import { CATEGORIES, PERIOD_TYPE } from 'config/constants';
import { text10, text12, text14, text14B } from 'config/styles';
import { path } from 'config/path';
// utils
import { fNumber } from 'utils/formatNumber';
import { convertDayCodeToText } from 'utils/util';
import { fHmsToHm } from 'utils/formatDateTime';
// pages
import LessonCalendar from './LessonCalendar';

const Lesson = () => {
  const calendarRef = useRef();
  // data
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
    getPrograms({ variables: { categoryId: CATEGORIES[0].value } });
    // eslint-disable-next-line
  }, []);

  if (loading) return <>Loading...</>;
  if (error) return <>ERROR</>;

  const handleClick = (item) => {
    setItem(item);
    handleNavigate('calendar');
  };
  // const handleDate = (date) => {
  //   console.log('handleDate', date);
  // };
  const handleNavigate = (path) => {
    if (path === 'calendar') calendarRef.current.open();
  };

  return (
    <PageContainer label='레슨 수강'>
      {/* <Stack spacing={2}>
        <CalendarForm label='레슨 시작일' handleDate={handleDate} />
      </Stack>
      <GreyBox sx={{ height: '1px', mt: 2 }} /> */}

      <Stack spacing={2} sx={{ mb: 3 }}>
        {items &&
          items.map((item, index) => {
            const start = parseISO(
              `${item.lesson_start_date} ${item.lesson_start_time}`
            );
            const end = parseISO(
              `${item.lesson_start_date} ${item.lesson_end_time}`
            );
            item = {
              ...item,
              time: differenceInMinutes(end, start),
            };
            return (
              <Stack key={index}>
                <Box
                  sx={{
                    width: '100%',
                    height: 152,
                    backgroundImage: `url('${path.image}/${
                      item.user_image ? 'user/' + item.user_image : 'temp.png'
                    }')`,
                    backgroundSize: 'cover',
                  }}
                />
                <GreyBox sx={{ p: 2, mx: 0 }}>
                  <Stack direction={'row'} justifyContent={'space-between'}>
                    <Typography sx={{ ...text12, color: 'grey.800' }}>
                      {item.user_name}
                    </Typography>
                    <Stack direction={'row'} spacing={0.25}>
                      <Stack
                        sx={{ width: 16, height: 16, bgcolor: 'common.black' }}
                      >
                        <Typography
                          sx={{
                            ...text10,
                            lineHeight: '17px',
                            textAlign: 'center',
                            color: 'common.white',
                          }}
                        >
                          {convertDayCodeToText(item.lesson_day)}
                        </Typography>
                      </Stack>
                      <Stack sx={{ height: 16, px: 0.5, bgcolor: 'grey.400' }}>
                        <Typography
                          sx={{
                            ...text10,
                            lineHeight: '17px',
                            color: 'common.white',
                          }}
                        >
                          {item.lesson_type === '1' ? '개인' : '단체'}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                  <Typography sx={text14B}>{item.name}</Typography>
                  <Stack
                    direction={'row'}
                    justifyContent={'space-between'}
                    sx={{ mt: 2.5 }}
                  >
                    <Stack spacing={1}>
                      <Stack direction={'row'} spacing={0.5}>
                        <Typography sx={text14B}>{item.time}분</Typography>
                        <Typography sx={text14}>
                          {fHmsToHm(item.lesson_start_time)}-
                          {fHmsToHm(item.lesson_end_time)}
                        </Typography>
                      </Stack>
                      <Stack direction={'row'} spacing={0.5}>
                        <Typography sx={text14B}>
                          {`${item.period}${PERIOD_TYPE[item.period_type]}`}
                        </Typography>
                        <Typography sx={text14}>
                          {fNumber(item.price)}원
                        </Typography>
                      </Stack>
                    </Stack>
                    <TButton
                      label='구매하기'
                      sx={{ width: 80, height: 40, p: 0 }}
                      onClick={() => handleClick(item)}
                    />
                  </Stack>
                </GreyBox>
              </Stack>
            );
          })}
      </Stack>
      <LessonCalendar ref={calendarRef} lesson={item} />
    </PageContainer>
  );
};

export default Lesson;
