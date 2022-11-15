import { useEffect, useState } from 'react';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from 'react-device-detect';
import { concat } from 'lodash';
// material
import { Box, Stack, Tab } from '@mui/material';
import { TabContext, TabList } from '@mui/lab';
// graphql
import { useLazyQuery } from '@apollo/client';
import { BOOKINGS_QUERY } from 'graphql/query';
// component
import { MainCard } from 'components/ui/cards';
import { AddButton } from 'components/ui/cards/secondary';
import { BookingBrowser, BookingMobile } from 'components/page/booking';
// helper
import { getAuthUser } from 'helpers/storage';
// config
import { path } from 'config/path';
// util
import { scrollToTop } from 'utils/util';
// pages
import LoadingPage from 'pages/Loading';
import ErrorPage from 'pages/Error';
// import { Store } from 'components/app';

const LIST_LIMIT = 20;

const BookingBox = ({
  bookings,
  currentPage,
  totalPage,
  totalRow,
  handleChange,
  handleScroll,
  handleCancel,
}) => {
  return (
    <>
      <BrowserView>
        <BookingBrowser
          data={bookings}
          pagination={totalPage > 0 && totalRow > LIST_LIMIT}
          totalPage={totalPage}
          handleCancel={handleCancel}
          handleChange={handleChange}
        />
      </BrowserView>
      <MobileView>
        <BookingMobile
          data={bookings}
          currentPage={currentPage}
          handleCancel={handleCancel}
          handleScroll={handleScroll}
        />
      </MobileView>
    </>
  );
};
const Booking = () => {
  // data
  const [bookings, setBookings] = useState();
  const [totalPage, setTotalPage] = useState(0);
  const [totalRow, setTotalRow] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [value, setValue] = useState('next');
  // graphql
  const [getBookings, { loading, error, fetchMore }] = useLazyQuery(
    BOOKINGS_QUERY,
    {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-first',
      onCompleted: (data) => {
        if (data.clt_bookings) {
          if (isBrowser) {
            setBookings(data.clt_bookings.items);
          } else {
            if (currentPage === 1) {
              setBookings(data.clt_bookings.items);
            } else {
              setBookings(concat(bookings, data.clt_bookings.items));
            }
          }

          if (totalPage !== data.clt_bookings.pageInfo.totalPage) {
            setTotalPage(data.clt_bookings.pageInfo.totalPage);
          }
          if (totalRow !== data.clt_bookings.pageInfo.totalRow) {
            setTotalRow(data.clt_bookings.pageInfo.totalRow);
          }
        }
      },
    }
  );

  useEffect(() => {
    handleBookings();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (bookings && isBrowser) {
      scrollToTop();
    }
  }, [bookings]);

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage />;

  const handleBookings = (type) => {
    const variables = {
      memberId: getAuthUser().id,
      limit: LIST_LIMIT,
      offset: 0,
      type: type ? type : value,
    };
    getBookings({ variables: variables });
  };
  const handleChangeTabs = (_, newValue) => {
    setValue(newValue);
    handleBookings(newValue);
  };
  const handleChangePage = (_, page) => {
    fetchMore({
      variables: { offset: (page - 1) * LIST_LIMIT },
    });
    setCurrentPage(page);
  };
  const handleInfiniteScroll = () => {
    if (isMobile && totalPage > 0 && totalRow > currentPage * LIST_LIMIT) {
      fetchMore({
        variables: { offset: currentPage * LIST_LIMIT },
      });
      setCurrentPage(currentPage + 1);
    }
  };
  const handleCancel = (id) => {
    console.log('handleCancel', id);
  };

  return (
    <MainCard
      darkTitle
      title='예약 내역'
      secondary={
        <Stack direction={'row'} spacing={1}>
          {/* <Store allitem size='small' sx={{ width: '100%' }} /> */}
          <AddButton title='예약하기' url={path.urls.bookingEdit} />
        </Stack>
      }
    >
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTabs}>
            <Tab label='예약 내역' value='next' />
            <Tab label='지난 예약 내역' value='prev' />
          </TabList>
        </Box>
      </TabContext>

      <MobileView>
        <Box sx={{ height: 20 }} />
      </MobileView>
      <BookingBox
        bookings={bookings}
        currentPage={currentPage}
        totalPage={totalPage}
        totalRow={totalRow}
        handleChange={handleChangePage}
        handleScroll={handleInfiniteScroll}
        handleCancel={handleCancel}
      />
    </MainCard>
  );
};

export default Booking;
