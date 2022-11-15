import { useEffect, useState } from 'react';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from 'react-device-detect';
import { concat } from 'lodash';
// graphql
import { useLazyQuery } from '@apollo/client';
import { PAYMENTS_QUERY } from 'graphql/query';
// component
import { MainCard } from 'components/ui/cards';
import { PaymentBrowser, PaymentMobile } from 'components/page/ticket';
// helper
import { getAuthUser } from 'helpers/storage';
// util
import { scrollToTop } from 'utils/util';
// pages
import LoadingPage from 'pages/Loading';
import ErrorPage from 'pages/Error';

const LIST_LIMIT = 20;
const Ticket = () => {
  // data
  const [payments, setPayments] = useState();
  const [totalPage, setTotalPage] = useState(0);
  const [totalRow, setTotalRow] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  // graphql
  const [getPayments, { loading, error, fetchMore }] = useLazyQuery(
    PAYMENTS_QUERY,
    {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-first',
      onCompleted: (data) => {
        if (data.clt_payments) {
          if (isBrowser) {
            setPayments(data.clt_payments.items);
          } else {
            if (currentPage === 1) {
              setPayments(data.clt_payments.items);
            } else {
              setPayments(concat(payments, data.clt_payments.items));
            }
          }

          if (totalPage !== data.clt_payments.pageInfo.totalPage) {
            setTotalPage(data.clt_payments.pageInfo.totalPage);
          }
          if (totalRow !== data.clt_payments.pageInfo.totalRow) {
            setTotalRow(data.clt_payments.pageInfo.totalRow);
          }
        }
      },
    }
  );

  useEffect(() => {
    getPayments({
      variables: { memberId: getAuthUser().id, limit: LIST_LIMIT, offset: 0 },
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (payments && isBrowser) {
      scrollToTop();
    }
  }, [payments]);

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage />;

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

  return (
    <MainCard darkTitle title='구매내역'>
      <BrowserView>
        <PaymentBrowser
          data={payments}
          pagination={totalPage > 0 && totalRow > LIST_LIMIT}
          totalPage={totalPage}
          handleChange={handleChangePage}
        />
      </BrowserView>
      <MobileView>
        <PaymentMobile
          data={payments}
          currentPage={currentPage}
          handleScroll={handleInfiniteScroll}
        />
      </MobileView>
    </MainCard>
  );
};

export default Ticket;
