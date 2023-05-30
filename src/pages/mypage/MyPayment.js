import { forwardRef, useEffect, useState } from 'react';
import { concat } from 'lodash';
import { addMonths, format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
// material
import { Dialog, DialogContent, Slide, Stack, Typography } from '@mui/material';
// graphql
import { useLazyQuery } from '@apollo/client';
import { PAYMENTS_QUERY } from 'graphql/query';
// components
import { DialogContainer, GreyBox } from 'components/page';
import { TButton } from 'components/ui';
// config
import { text12, text14, text15, text16B, text28B } from 'config/styles';
import { ChevronDownIcon, CloseIcon } from 'config/icons';
import {
  DATE_FORMAT,
  PAY_TO,
  PAY_TYPE,
  PERIOD_TYPE,
  YMD_DAY_FORMAT,
} from 'config/constants';
// helpers
import { getAuthStore, getAuthUser } from 'helpers/storage';
import { fNumber } from 'utils/formatNumber';
import { DAY_OF_WEEK_KO } from 'config/constants';

const SEARCH_TEXT = {
  1: '1개월',
  3: '3개월',
  6: '6개월',
  12: '1년',
  all: '전체조회',
  ticket: '이용권만',
  lesson: '레슨만',
  daily: '당일결제만',
  newest: '최신순',
  oldest: '과거순',
};
const INIT_SEARCH = {
  period: '1',
  type: '',
  sort: 'newest',
};
const LIST_LIMIT = 20;
const MyPayment = forwardRef((_, ref) => {
  // data
  const [items, setItems] = useState();
  const [totalPage, setTotalPage] = useState(0);
  const [totalRow, setTotalRow] = useState(0);
  const [open, setOpen] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openSearch, setOpenSearch] = useState(false);
  const [search, setSearch] = useState(INIT_SEARCH);
  const [searchText, setSearchText] = useState(search);

  // graphql
  const [getPayments, { fetchMore }] = useLazyQuery(PAYMENTS_QUERY, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    onCompleted: (data) => {
      if (data.clt_payments) {
        if (currentPage === 1) {
          setItems(data.clt_payments.items);
        } else {
          setItems(concat(items, data.clt_payments.items));
        }

        if (totalPage !== data.clt_payments.pageInfo.totalPage) {
          setTotalPage(data.clt_payments.pageInfo.totalPage);
        }
        if (totalRow !== data.clt_payments.pageInfo.totalRow) {
          setTotalRow(data.clt_payments.pageInfo.totalRow);
        }
      }
    },
  });

  useEffect(() => {
    if (open) {
      setHasMore(totalPage > 0 && totalRow > currentPage * LIST_LIMIT);
    } else {
      setHasMore(false);
    }
  }, [totalPage, totalRow, currentPage, open]);

  // page open
  const handleOpen = (open) => {
    setOpen(open);
    if (open) {
      handlePayments();
    } else {
      setSearch(INIT_SEARCH);
      setSearchText(INIT_SEARCH);
    }
  };

  const handlePayments = () => {
    setCurrentPage(1);

    const temp = { sort: search.sort };
    if (search.period !== 'all') {
      temp.date = format(
        addMonths(new Date(), -Number(search.period)),
        DATE_FORMAT
      );
    }
    if (search.type !== '') {
      temp.type = search.type;
    }

    const variables = {
      memberId: getAuthUser().id,
      limit: LIST_LIMIT,
      offset: 0,
      search: JSON.stringify(temp),
    };
    getPayments({ variables });
  };
  const handleScroll = () => {
    if (totalPage > 0 && totalRow > currentPage * LIST_LIMIT) {
      fetchMore({
        variables: { offset: currentPage * LIST_LIMIT },
      });
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearch = (key, value) => {
    if (key === 'search') {
      setSearchText(search);
      setOpenSearch(false);
      handlePayments();
    } else {
      if (key === 'type' && search.type === value) {
        setSearch((prev) => {
          return {
            ...prev,
            type: '',
          };
        });
      } else {
        setSearch((prev) => {
          return {
            ...prev,
            [key]: value,
          };
        });
      }
    }
  };

  return (
    <DialogContainer
      ref={ref}
      title='구매내역'
      scroll={{
        start: currentPage - 1,
        loadMore: handleScroll,
        hasMore: hasMore,
      }}
      handleOpen={handleOpen}
    >
      <GreyBox sx={{ p: 2, mt: -3 }}>
        <Stack
          direction={'row'}
          spacing={1.5}
          onClick={() => setOpenSearch(true)}
        >
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            sx={{ width: '100%' }}
          >
            <Typography sx={{ ...text12, color: 'grey.1000' }}>
              {searchText.period === 'all' ? '' : '최근 '}
              {SEARCH_TEXT[searchText.period]}
            </Typography>
            <Typography sx={{ ...text12, color: 'grey.1000' }}>
              {SEARCH_TEXT[searchText.type]}
            </Typography>
            <Typography sx={{ ...text12, color: 'grey.1000' }}>
              {SEARCH_TEXT[searchText.sort]}
            </Typography>
          </Stack>
          <ChevronDownIcon sx={{ width: 5.48, height: 9.42 }} />
        </Stack>
        <Stack spacing={2} sx={{ mt: 2.5 }}>
          {items &&
            items.map((item, index) => {
              const isLesson = item.category.indexOf('레슨');
              const created = parseISO(item.created);
              const payto_text = PAY_TO[item.payto] || '';
              const paytype_text = ` (${PAY_TYPE[item.paytype]})` || '';
              return (
                <Stack sx={{ bgcolor: 'common.white', p: 2 }} key={index}>
                  <Stack direction={'row'} justifyContent={'space-between'}>
                    <Typography sx={text14}>{getAuthStore().name}</Typography>
                    <Typography sx={{ ...text14, color: 'grey.1000' }}>
                      {format(created, YMD_DAY_FORMAT, { locale: ko })}
                    </Typography>
                  </Stack>
                  <Stack
                    direction={'row'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    sx={{
                      mt: 1.5,
                      pb: 2,
                      borderBottom: '1px dashed #CECECE',
                    }}
                  >
                    {isLesson === 0 && (
                      <Typography sx={text16B}>
                        {item.program_name}/ {item.period}
                        {PERIOD_TYPE[item.period_type]}
                        {item.lesson_day &&
                          `/ ${DAY_OF_WEEK_KO[item.lesson_day]}`}
                      </Typography>
                    )}
                    {isLesson === -1 && (
                      <Stack
                        direction={'row'}
                        spacing={0.5}
                        alignItems={'flex-end'}
                      >
                        <Typography sx={text28B}>
                          {item.period}
                          {PERIOD_TYPE[item.period_type]}
                        </Typography>
                        <Typography sx={text16B}>
                          {item.category.indexOf('당일') === -1
                            ? '이용권'
                            : '당일 예약/결제'}
                        </Typography>
                        <Typography sx={{ ...text15, color: 'grey.800' }}>
                          (
                          {Number(item.period) *
                            (item.period_type === '2' ? 60 : 1)}
                          분)
                        </Typography>
                      </Stack>
                    )}
                    {/* <MoreVertIcon color='grey' /> */}
                  </Stack>
                  <Stack
                    direction={'row'}
                    justifyContent={'space-between'}
                    sx={{ mt: 1 }}
                  >
                    <Typography sx={text14}>금액</Typography>
                    <Typography sx={text16B}>
                      {fNumber(item.price)}원
                    </Typography>
                  </Stack>
                  <Typography sx={{ ...text12, color: 'grey.800', mt: 2 }}>
                    {payto_text}
                    {paytype_text}
                  </Typography>
                </Stack>
              );
            })}
        </Stack>
      </GreyBox>
      <SearchDialog
        open={openSearch}
        setOpen={setOpenSearch}
        search={search}
        onClick={handleSearch}
      />
    </DialogContainer>
  );
});

const SButton = ({ label, search, value, onClick }) => {
  return (
    <TButton
      color='white'
      label={label}
      sx={{
        height: 44,
        border: 1,
        borderColor: search === value ? 'common.black' : 'grey.800',
      }}
      onClick={onClick}
    />
  );
};
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});
const SearchDialog = ({ open, setOpen, search, onClick }) => {
  return (
    <Dialog
      fullScreen
      open={open}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          position: 'absolute',
          top: 'calc(150% - 534px)',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        },
      }}
    >
      <DialogContent sx={{ p: 2 }}>
        <CloseIcon
          sx={{ position: 'absolute', top: 24, right: 21 }}
          onClick={() => setOpen(false)}
        />
        <Typography sx={{ ...text14, pt: 1, pb: 2.5 }}>예약하기</Typography>
        <Stack spacing={4}>
          <Stack spacing={1}>
            <Typography sx={{ ...text16B, pb: 1 }}>조회 기간</Typography>
            <Stack direction={'row'} spacing={1}>
              <SButton
                label='1개월'
                search={search['period']}
                value='1'
                onClick={() => onClick('period', '1')}
              />
              <SButton
                label='3개월'
                search={search['period']}
                value='3'
                onClick={() => onClick('period', '3')}
              />
              <SButton
                label='6개월'
                search={search['period']}
                value='6'
                onClick={() => onClick('period', '6')}
              />
              <SButton
                label='1년'
                search={search['period']}
                value='12'
                onClick={() => onClick('period', '12')}
              />
            </Stack>
            <SButton
              label='전체조회'
              search={search['period']}
              value='all'
              onClick={() => onClick('period', 'all')}
            />
          </Stack>
          <Stack spacing={1}>
            <Typography sx={{ ...text16B, pb: 1 }}>조회 항목</Typography>
            <Stack direction={'row'} spacing={1}>
              <SButton
                label='이용권만'
                search={search['type']}
                value='ticket'
                onClick={() => onClick('type', 'ticket')}
              />
              <SButton
                label='레슨만'
                search={search['type']}
                value='lesson'
                onClick={() => onClick('type', 'lesson')}
              />
              <SButton
                label='당일결제만'
                search={search['type']}
                value='daily'
                onClick={() => onClick('type', 'daily')}
              />
            </Stack>
          </Stack>
          <Stack spacing={1}>
            <Typography sx={{ ...text16B, pb: 1 }}>정렬</Typography>
            <Stack direction={'row'} spacing={1}>
              <SButton
                label='최신순'
                search={search['sort']}
                value='newest'
                onClick={() => onClick('sort', 'newest')}
              />
              <SButton
                label='과거순'
                search={search['sort']}
                value='oldest'
                onClick={() => onClick('sort', 'oldest')}
              />
            </Stack>
          </Stack>
        </Stack>
        <TButton
          label='조회하기'
          sx={{ mt: 5 }}
          onClick={() => onClick('search')}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MyPayment;
