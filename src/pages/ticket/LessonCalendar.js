import { forwardRef, useEffect, useRef, useState } from 'react';
import { addDays, format, parseISO } from 'date-fns';
import { forEach, includes } from 'lodash';
// material
import { Box, Stack, Typography } from '@mui/material';
// graphql
import { useLazyQuery } from '@apollo/client';
import { PROGRAM_LESSON_BOOKED_QUERY } from 'graphql/query';
// components
import { DialogContainer } from 'components/page';
import { CalendarLesson } from 'components/app';
import { TButton } from 'components/ui';
// config
import { text11, text14, text14B } from 'config/styles';
import { DATE_FORMAT, PERIOD_TYPE } from 'config/constants';
// helpers
import { getAuthUser } from 'helpers/storage';
// utils
import { fNumber } from 'utils/formatNumber';
import { convertDayCodeToText } from 'utils/util';
import { fDateToDot, fHmsToHm } from 'utils/formatDateTime';
// pages
import Payment from './Payment';

const LessonCalendar = forwardRef(({ lesson }, ref) => {
  const paymentRef = useRef();
  // data
  const [item, setItem] = useState();
  const [booked, setBooked] = useState();
  const [selected, setSelected] = useState([]);
  const [lessonDate, setLessonDate] = useState();

  // graphql
  const [getLessonBooked] = useLazyQuery(PROGRAM_LESSON_BOOKED_QUERY, {
    onCompleted: (data) => {
      if (data.clt_programlessonbooked) {
        const bookedData = {};
        forEach(data.clt_programlessonbooked, (program) => {
          bookedData[program.date] = {
            ...program,
            booking: includes(program.members, getAuthUser().id) ? true : false,
          };
        });
        setBooked(bookedData);
      }
    },
  });

  useEffect(() => {
    if (lesson) {
      getLessonBooked({ variables: { programId: lesson.id } });
    }
    // eslint-disable-next-line
  }, [lesson]);

  // page open
  const handleOpen = (open) => {
    if (open) {
      setSelected([]);
      setLessonDate();
    }
  };
  const handleDate = (date) => {
    const period = Number(lesson.period);
    const d = parseISO(`${date.year}-${date.month}-${date.date}`);
    const dates = [];
    for (let i = 0; i < period; i++) {
      dates.push(format(addDays(d, i * 7), DATE_FORMAT));
    }
    setSelected(dates);
    setLessonDate(
      `${fDateToDot(dates[0])} - ${fDateToDot(dates[dates.length - 1])}`
    );
    setItem({ ...lesson, dates });
  };
  const handleNavigate = (path) => {
    if (path === 'payment') paymentRef.current.open();
  };
  return (
    <DialogContainer
      ref={ref}
      title='레슨 날짜 선택'
      isFooter={false}
      handleOpen={handleOpen}
    >
      <Stack direction={'row'} spacing={1}>
        <Typography sx={text14B}>
          {lesson && convertDayCodeToText(lesson.lesson_day)}요일
        </Typography>
        <Stack direction={'row'} spacing={0.5}>
          <Typography sx={text14B}>{lesson && lesson.time}분</Typography>
          <Typography sx={text14}>
            {lesson && fHmsToHm(lesson.lesson_start_time)}-
            {lesson && fHmsToHm(lesson.lesson_end_time)}
          </Typography>
        </Stack>
        <Stack direction={'row'} spacing={0.5}>
          <Typography sx={text14B}>
            {lesson && `${lesson.period}${PERIOD_TYPE[lesson.period_type]}`}
          </Typography>
          <Typography sx={text14}>
            {lesson && fNumber(lesson.price)}원
          </Typography>
        </Stack>
      </Stack>
      <Stack
        direction={'row'}
        justifyContent={'flex-end'}
        spacing={1}
        sx={{ mt: 3, mb: 2 }}
      >
        <Stack direction={'row'} spacing={0.5}>
          <Box sx={{ width: 8, height: 8, border: 1, mt: 0.1 }} />
          <Typography sx={text11}>예약가능</Typography>
        </Stack>
        <Stack direction={'row'} spacing={0.5}>
          <Box sx={{ width: 8, height: 8, bgcolor: 'grey.200', mt: 0.1 }} />
          <Typography sx={text11}>예약불가</Typography>
        </Stack>
        <Stack direction={'row'} spacing={0.5}>
          <Box
            sx={{
              width: 8,
              height: 8,
              border: 1,
              borderColor: 'error.main',
              mt: 0.1,
            }}
          />
          <Typography sx={text11}>나의 예약</Typography>
        </Stack>
      </Stack>
      <CalendarLesson
        lesson={lesson}
        booked={booked}
        selected={selected}
        handleDate={handleDate}
      />
      {lessonDate && (
        <LessonModal
          lessonDate={lessonDate}
          onClick={() => handleNavigate('payment')}
        />
      )}
      <Payment ref={paymentRef} item={item} />
    </DialogContainer>
  );
});

const LessonModal = ({ lessonDate, onClick }) => {
  return (
    <Stack
      spacing={2}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        p: 2,
        bgcolor: 'grey.100',
      }}
    >
      <Typography sx={{ ...text14, textAlign: 'center' }}>
        {lessonDate}
      </Typography>
      <TButton label='레슨 구매 하기' onClick={onClick} />
    </Stack>
  );
};

export default LessonCalendar;
