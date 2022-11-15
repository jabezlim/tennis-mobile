import { useEffect, useState } from 'react';
import { differenceInDays, format, getDay, parseISO } from 'date-fns';
// material
import { Table, TableBody, TableContainer, Typography } from '@mui/material';
// component
import { TableHeadCell, TableBodyRow } from 'components/ui/table';
import { Paginations } from 'components/ui/extended';
// util
import { fDateIE, fTimeSuffix } from 'utils/formatDateTime';
// config
import {
  BOOKING_TYPE,
  DATE_FORMAT,
  DAY_OF_WEEK,
  DAY_OF_WEEK_KO,
} from 'config/constants';

const TABLE_HEAD = [
  { label: '지점명', alignLeft: true },
  { label: '예약 타입' },
  { label: '코트/레슨명' },
  { label: '예약 날짜' },
  { label: '시작 시간' },
  { label: '완료 시간' },
  { label: '예약일' },
  // { label: '예약 취소' },
];
const BookingBrowser = ({
  data,
  pagination,
  totalPage,
  handleCancel,
  handleChange,
}) => {
  // data
  const [bookings, setBookings] = useState();
  const [tableBodyKeys, setTableBodyKeys] = useState();
  const [today] = useState(parseISO(format(new Date(), DATE_FORMAT)));

  useEffect(() => {
    setTableBodyKeys([
      { id: 'store_name', alignLeft: true },
      { id: 'booking_type' },
      { id: 'machine_name' },
      { id: 'start_date', fn: handleDay },
      { id: 'start_time_text' },
      { id: 'end_time_text' },
      { id: 'created_text' },
      // { id: 'cancel', fn: handleCancelBtn },
    ]);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (data) {
      setBookings(data);
    }
  }, [data]);

  const handleDay = (date) => {
    const d = parseISO(date);
    const day = DAY_OF_WEEK[getDay(d)];
    const period = differenceInDays(d, today);
    let color = 'inherit';
    if (period === 0) color = 'success.dark';
    else if (period > 0) color = 'primary.dark';
    return (
      <Typography sx={{ color }}>
        {date} ({DAY_OF_WEEK_KO[day]})
      </Typography>
    );
  };
  // const handleCancelBtn = (data) => {
  //   if (differenceInMinutes(parseISO(data.start), new Date()) < 60) {
  //     return <></>;
  //   }
  //   return (
  //     <Button
  //       variant='outlined'
  //       color='error'
  //       onClick={() => handleCancel(data.id)}
  //     >
  //       예약취소
  //     </Button>
  //   );
  // };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHeadCell labels={TABLE_HEAD} />
          <TableBody>
            {bookings &&
              bookings.map((booking, index) => {
                // let discount_text = '';
                // if (booking.discount) {
                //   discount_text = booking.discount.substring(
                //     0,
                //     booking.discount.length - 1
                //   );
                //   if (discount_text === '0') discount_text = '';
                //   else {
                //     if (endsWith(booking.discount, 'm')) discount_text += ' 분';
                //     else if (endsWith(booking.discount, 'p'))
                //       discount_text += ' 원';
                //   }
                // }
                const data = {
                  booking_type: BOOKING_TYPE[booking.type],
                  store_name: booking.store_name,
                  machine_name: booking.machine_program_name,
                  start_date: booking.start_date,
                  start_time_text: fTimeSuffix(
                    `${booking.start_date} ${booking.start_time}`
                  ),
                  end_time_text: fTimeSuffix(
                    `${booking.end_date} ${booking.end_time}`
                  ),
                  created_text: fDateIE(booking.created),
                  cancel: {
                    id: booking.id,
                    start: `${booking.start_date} ${booking.start_time}`,
                  },
                };

                return (
                  <TableBodyRow keys={tableBodyKeys} data={data} key={index} />
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && (
        <Paginations totalPage={totalPage} handleChange={handleChange} />
      )}
    </>
  );
};

export default BookingBrowser;
