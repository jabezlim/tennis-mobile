import { forwardRef, useEffect, useState } from 'react';
import { addDays, format, parseISO } from 'date-fns';
import { forEach, includes } from 'lodash';
// material
import {
  Box,
  Button,
  Dialog,
  Slide,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
// graphql
import { useLazyQuery } from '@apollo/client';
import { PROGRAM_LESSON_BOOKED_QUERY } from 'graphql/query';
// components
import { Calendar } from 'components/app';
// config
import { DAY_OF_WEEK_KO, PERIOD_TYPE } from 'config/constants';
// helpers
import { getAuthUser } from 'helpers/storage';
// utils
import { fNumber } from 'utils/formatNumber';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});
const LessonCalendar = ({ open, setOpen, lesson, handleClick }) => {
  const matchXS = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  // data
  const [lessonDates, setLessonDates] = useState();
  const [lessonDateText, setLessonDateText] = useState();
  const [booked, setBooked] = useState();
  // graphql
  const [getLessonBooked] = useLazyQuery(PROGRAM_LESSON_BOOKED_QUERY, {
    onCompleted: (data) => {
      if (data.clt_programlessonbooked) {
        const bookedData = {};
        forEach(data.clt_programlessonbooked, (program) => {
          bookedData[program.date] = {
            ...program,
            book: includes(program.members, getAuthUser().id) ? true : false,
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

  const handleClose = () => {
    setLessonDates();
    setLessonDateText();
    setOpen(false);
  };

  const handleDate = (date) => {
    const period = Number(lesson.period);
    const d = parseISO(`${date.year}-${date.month}-${date.day}`);
    const dates = [];
    for (let i = 0; i < period; i++) {
      dates.push(format(addDays(d, i * 7), 'yyyy-MM-dd'));
    }
    setLessonDates(dates);
    setLessonDateText(`${dates[0]} ~ ${dates[dates.length - 1]}`);
  };

  const handleClickCalendar = () => {
    if (!lessonDates) return;
    if (handleClick) handleClick(lessonDates);
    handleClose();
  };

  return (
    <Dialog
      fullWidth
      fullScreen={matchXS}
      open={open}
      // onClose={handleClose}
      TransitionComponent={Transition}
    >
      <Box sx={{ p: 2 }}>
        {matchXS && (
          <Typography variant='h3' sx={{ mb: 2 }}>
            예약일 선택
          </Typography>
        )}
        {lesson && (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent='space-between'
            sx={{ mb: 2 }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Stack direction={'row'} spacing={1}>
                <Typography variant='h4'>
                  {DAY_OF_WEEK_KO[lesson.lesson_day]}: {lesson.period}
                  {PERIOD_TYPE[lesson.period_type]}
                </Typography>
                <Typography variant='h4'>{fNumber(lesson.price)}원</Typography>
              </Stack>
              <Typography variant='h4' sx={{ pl: { xs: 7, sm: 0 } }}>
                {lesson.lesson_time}
              </Typography>
            </Stack>
            <Stack direction={'row'} spacing={1} justifyContent='flex-end'>
              <Stack direction={'row'} spacing={0.5}>
                <Box
                  sx={{
                    mt: 0.2,
                    width: 14,
                    height: 14,
                    backgroundColor: 'common.black',
                  }}
                />
                <Typography>나의 예약</Typography>
              </Stack>
              <Stack direction={'row'} spacing={0.5}>
                <Box
                  sx={{
                    mt: 0.2,
                    width: 14,
                    height: 14,
                    backgroundColor: 'error.main',
                  }}
                />
                <Typography>예약완료(예약불가)</Typography>
              </Stack>
            </Stack>
          </Stack>
        )}

        <Calendar
          lesson={lesson}
          selected={lessonDates}
          booked={booked}
          handleDate={handleDate}
        />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ mt: 3 }}
        >
          <Button
            fullWidth
            variant='outlined'
            color='tennis'
            onClick={handleClose}
            sx={{ borderRadius: 4.9 }}
          >
            취소
          </Button>
          <Button
            fullWidth
            variant='contained'
            color='tennis'
            disabled={!lessonDates || lessonDates.length === 0}
            onClick={handleClickCalendar}
            sx={{ borderRadius: 4.9 }}
          >
            선택 {lessonDateText && `(${lessonDateText})`}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default LessonCalendar;
