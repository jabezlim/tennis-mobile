import { useEffect, useState } from 'react';
// material
import { Box, Button, Grid, Typography } from '@mui/material';
// graphql
import { useLazyQuery } from '@apollo/client';
import { PROGRAMS_QUERY } from 'graphql/query';
// components
import { MainCard } from 'components/ui/cards';
// config
import { CATEGORIES, PERIOD_TYPE } from 'config/constants';
// utils
import { fNumber } from 'utils/formatNumber';
import PaymentDialog from './PaymentDialog';

const Machine = () => {
  // data
  const [items, setItems] = useState();
  const [item, setItem] = useState();
  const [open, setOpen] = useState(false);

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

  const handleClick = (item) => {
    setItem(item);
    setOpen(true);
  };

  return (
    <MainCard darkTitle title={CATEGORIES[1].label}>
      <Grid
        container
        spacing={2}
        columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
      >
        {items &&
          items.map((item, index) => (
            <Grid item xs={1} sm={1} md={1} lg={1} xl={1} key={index}>
              <Button
                fullWidth
                color='tennis'
                variant='contained'
                sx={{ py: 2, borderRadius: 3 }}
                onClick={() => handleClick(item)}
              >
                <Box>
                  <Typography sx={{ fontSize: 26, color: 'common.black' }}>
                    {item.period}
                    {PERIOD_TYPE[item.period_type]}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 26,
                      fontWeight: 700,
                    }}
                  >
                    {fNumber(item.price)} 원
                  </Typography>
                  <Typography sx={{ fontSize: 23, color: 'common.black' }}>
                    {item.name}
                  </Typography>
                </Box>
              </Button>
            </Grid>
          ))}
      </Grid>
      <Typography sx={{ fontSize: 16, mt: 3 }}>
        * 사용기간은 6개월입니다
      </Typography>
      <PaymentDialog open={open} setOpen={setOpen} item={item} />
    </MainCard>
  );
};

export default Machine;
