import { useEffect, useState } from 'react';
import { forEach } from 'lodash';
import { differenceInDays, format, parseISO } from 'date-fns';
// material
import { Stack, Typography } from '@mui/material';
// graphql
import { useLazyQuery, useQuery, useReactiveVar } from '@apollo/client';
import {
  DISCOUNT_SCHEDULE_QUERY,
  MACHINE_BOOKED_QUERY,
  MACHINE_LESSON_QUERY,
  MEMBER_TIMES_QUERY,
} from 'graphql/query';
// context
import { useGlobalContext } from 'context';
// component
import { MainCard } from 'components/ui/cards';
import { BookingForm } from 'components/page/booking';
// helper
import { createLessonBookedData } from 'helpers/timeTable';
import { storeDataVar } from 'helpers/cache';
// config
import { DATE_FORMAT } from 'config/constants';

const BookingEdit = () => {
  const { settingMessage } = useGlobalContext();
  const storeData = useReactiveVar(storeDataVar);
  // data
  const [memberTime, setMemberTime] = useState(0);
  const [lessons, setLessons] = useState();
  const [discount, setDiscount] = useState();
  const [booked, setBooked] = useState();
  const [isToday, setIsToday] = useState(true);
  // graphql
  const { loading } = useQuery(MEMBER_TIMES_QUERY, {
    onCompleted: (data) => {
      if (data.clt_membertimes && data.clt_membertimes.length > 0) {
        const totalTime = data.clt_membertimes.reduce(
          (previousValue, currentValue) => {
            return previousValue + (currentValue.time - currentValue.used_time);
          },
          0
        );
        setMemberTime(totalTime);
      }
    },
  });
  useQuery(MACHINE_LESSON_QUERY, {
    variables: { storeId: storeData.id },
    onCompleted: (data) => {
      if (data.clt_machinelesson && data.clt_machinelesson.length > 0) {
        const lessons = createLessonBookedData(data.clt_machinelesson);
        setLessons(lessons);
      }
    },
  });
  useQuery(DISCOUNT_SCHEDULE_QUERY, {
    variables: { storeId: storeData.id },
    onCompleted: (data) => {
      if (data.clt_discountschedule) {
        const dayOfWeek = {};
        forEach(data.clt_discountschedule, (d) => {
          if (!dayOfWeek[d.day]) dayOfWeek[d.day] = {};
          dayOfWeek[d.day][d.time] = d.discount;
        });
        setDiscount(dayOfWeek);
      }
    },
  });
  const [getMachineBooked] = useLazyQuery(MACHINE_BOOKED_QUERY, {
    onCompleted: (data) => {
      if (data.clt_machinebooked) {
        setBooked(data.clt_machinebooked);
      }
    },
    onError: () => {
      handleMessage('오류가 발생했습니다. 잠시 후에 다시 사용해 주세요.');
    },
  });

  useEffect(() => {
    handleMachineBookedData(new Date());
    // eslint-disable-next-line
  }, []);

  const handleMachineBookedData = (date) => {
    getMachineBooked({
      variables: {
        storeId: storeData.id,
        date: format(date, DATE_FORMAT),
      },
    });
  };
  const handleChangeDate = (date) => {
    setIsToday(
      differenceInDays(
        parseISO(format(date, DATE_FORMAT)),
        parseISO(format(new Date(), DATE_FORMAT))
      ) === 0
    );
    handleMachineBookedData(date);
  };
  const handleMessage = (message) => {
    settingMessage('open', true);
    settingMessage('message', message);
  };

  return (
    <>
      <MainCard darkTitle title='예약하기' contentSX={{ maxWidth: 800 }}>
        {loading && (
          <Typography variant='h4'>사용 가능 시간 조회중...</Typography>
        )}
        {!loading && (
          <Stack direction='row' sx={{ mb: 3 }} spacing={1}>
            <Typography variant='h4' sx={{ fontWeight: 500 }}>
              사용 가능 시간:
            </Typography>
            <Typography variant='h4'>{memberTime} 분</Typography>
          </Stack>
        )}
        {!loading && memberTime === 0 && (
          <Typography variant='h4' color={'error'} sx={{ mb: 3 }}>
            예약 가능 시간이 없습니다.
          </Typography>
        )}
        {!loading && (
          <BookingForm
            memberTime={memberTime}
            discount={discount}
            booked={booked}
            lessons={lessons}
            isToday={isToday}
            handleDate={handleChangeDate}
            handleMessage={handleMessage}
          />
        )}
      </MainCard>
    </>
  );
};

export default BookingEdit;
