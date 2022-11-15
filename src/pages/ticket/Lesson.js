import { useEffect, useState } from 'react';
// material
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
// graphql
import { useLazyQuery } from '@apollo/client';
import { PROGRAMS_QUERY } from 'graphql/query';
// components
import { MainCard } from 'components/ui/cards';
// config
import { path } from 'config/path';
import { CATEGORIES, PERIOD_TYPE } from 'config/constants';
// utils
import { fNumber } from 'utils/formatNumber';
import { convertDayCodeToText } from 'utils/util';
import PaymentDialog from './PaymentDialog';
import LessonCalendar from './LessonCalendar';

const Lesson = () => {
  // data
  const [items, setItems] = useState();
  const [item, setItem] = useState();
  const [open, setOpen] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);

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
    setOpenCalendar(true);
  };
  const handleClickCalendar = (dates) => {
    setItem((prev) => {
      return {
        ...prev,
        dates,
      };
    });
    setOpen(true);
  };

  return (
    <MainCard darkTitle title={CATEGORIES[0].label}>
      <Grid
        container
        spacing={2}
        columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
      >
        {items &&
          items.map((item, index) => (
            <Grid item xs={1} sm={1} md={1} lg={1} xl={1} key={index}>
              <Card
                sx={{ border: 1, borderColor: 'grey.400', borderRadius: 3 }}
              >
                <CardActionArea onClick={() => handleClick(item)}>
                  <CardMedia
                    alt={item.member_name}
                    sx={{
                      width: '100%',
                      height: 200,
                      backgroundImage: `url('${path.image}/${
                        item.user_image ? 'user/' + item.user_image : 'temp.png'
                      }')`,
                      backgroundSize: 'cover',
                    }}
                  >
                    <Box
                      component='img'
                      src={`${path.basename}/images/icon/${
                        item.lesson_type === '1' ? 'personal' : 'group'
                      }.svg`}
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        width: 40,
                        height: 40,
                      }}
                    />
                  </CardMedia>
                  <CardContent sx={{ px: 2 }}>
                    <Typography
                      sx={{
                        fontSize: 20,
                        textAlign: 'center',
                        fontWeight: 700,
                        pb: 1,
                        borderBottom: 1,
                        borderColor: 'grey.400',
                      }}
                    >
                      {item.user_name}
                    </Typography>
                    <Typography sx={{ pt: 2, fontSize: 16, pb: 0.5 }}>
                      {item.name}
                    </Typography>
                    <Typography sx={{ fontSize: 16, pb: 0.5 }}>
                      {item.period}
                      {PERIOD_TYPE[item.period_type]}: {fNumber(item.price)}원
                    </Typography>
                    <Typography sx={{ fontSize: 16, pb: 0.5 }}>
                      {item.machine_name}
                    </Typography>
                    <Typography sx={{ fontSize: 16, pb: 0.5 }}>
                      {convertDayCodeToText(item.lesson_day)}
                    </Typography>
                    <Typography sx={{ fontSize: 16 }}>
                      {item.lesson_time}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
      </Grid>
      <LessonCalendar
        open={openCalendar}
        setOpen={setOpenCalendar}
        lesson={item}
        handleClick={handleClickCalendar}
      />
      <PaymentDialog open={open} setOpen={setOpen} item={item} />
    </MainCard>
  );
};

export default Lesson;
