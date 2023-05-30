import { forwardRef, useEffect, useState } from 'react';
import { concat, endsWith, startsWith } from 'lodash';
import { addMonths, format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
// material
import {
  Box,
  Dialog,
  DialogContent,
  Slide,
  Stack,
  Typography,
} from '@mui/material';
// graphql
import { useLazyQuery } from '@apollo/client';
import { MEMBER_VIDEOS_QUERY } from 'graphql/query';
// components
import { DialogContainer, GreyBox } from 'components/page';
import { TButton } from 'components/ui';
import { VideoDialog } from 'components/page/mypage';
// config
import { DATE_FORMAT, YMD_DAY_FORMAT } from 'config/constants';
import { ChevronDownIcon, CloseIcon } from 'config/icons';
import { text12, text14, text14B, text15B, text16B } from 'config/styles';
// utils
import { fDateIE, fTimeIE } from 'utils/formatDateTime';

const SEARCH_TEXT = {
  1: '1개월',
  3: '3개월',
  6: '6개월',
  12: '1년',
  all: '전체조회',
  newest: '최신순',
  oldest: '과거순',
};
const INIT_SEARCH = { period: '1', sort: 'newest' };
const LIST_LIMIT = 20;
const MyVideo = forwardRef((_, ref) => {
  // data
  const check = { date: null, index: 0 };
  const [items, setItems] = useState();
  const [totalPage, setTotalPage] = useState(0);
  const [totalRow, setTotalRow] = useState(0);
  const [open, setOpen] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openSearch, setOpenSearch] = useState(false);
  const [search, setSearch] = useState(INIT_SEARCH);
  const [searchText, setSearchText] = useState(search);
  const [openVideo, setOpenVideo] = useState(false);
  const [video, setVideo] = useState();

  // graphql
  const [getVideos, { fetchMore }] = useLazyQuery(MEMBER_VIDEOS_QUERY, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    onCompleted: (data) => {
      if (data.clt_membervideos) {
        if (currentPage === 1) {
          setItems(data.clt_membervideos.items);
        } else {
          setItems(concat(items, data.clt_membervideos.items));
        }

        if (totalPage !== data.clt_membervideos.pageInfo.totalPage) {
          setTotalPage(data.clt_membervideos.pageInfo.totalPage);
        }
        if (totalRow !== data.clt_membervideos.pageInfo.totalRow) {
          setTotalRow(data.clt_membervideos.pageInfo.totalRow);
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

  useEffect(() => {
    if (!openVideo) setVideo();
  }, [openVideo]);

  // page open
  const handleOpen = (open) => {
    setOpen(open);
    if (open) {
      handleVideos();
    } else {
      setSearch(INIT_SEARCH);
      setSearchText(INIT_SEARCH);
    }
  };

  const handleVideos = () => {
    setCurrentPage(1);

    const temp = { sort: search.sort };
    if (search.period !== 'all') {
      temp.date = format(
        addMonths(new Date(), -Number(search.period)),
        DATE_FORMAT
      );
    }
    const variables = {
      limit: LIST_LIMIT,
      offset: 0,
      search: JSON.stringify(temp),
    };
    getVideos({ variables });
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
      handleVideos();
    } else {
      setSearch((prev) => {
        return {
          ...prev,
          [key]: value,
        };
      });
    }
  };

  const handleClick = (video) => {
    let video_url = '';
    if (video.video_url) {
      video_url = endsWith(video.video_url, '/')
        ? video.video_url + video.video_name
        : video.video_url + '/' + video.video_name;
    } else {
      const addr = video.video_addr === '::1' ? 'localhost' : video.video_addr;
      const port = video.video_port ? ':' + video.video_port : '';
      video_url = addr + port + '/' + video.video_name;
    }
    if (
      !startsWith(video_url, 'http://') &&
      !startsWith(video_url, 'https://')
    ) {
      video_url = '//' + video_url;
    }
    setVideo(video_url);
    setOpenVideo(true);
  };

  return (
    <DialogContainer
      ref={ref}
      title='내 동영상'
      scroll={{
        start: currentPage - 1,
        loadMore: handleScroll,
        hasMore: hasMore,
      }}
      handleOpen={handleOpen}
    >
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
      <Stack sx={{ mt: 3 }}>
        {items &&
          items.map((item, index) => {
            const created = fDateIE(item.created);
            const CreateDate = () => {
              if (check.date === created) return <></>;
              else {
                check.date = created;
                const temp = parseISO(created);
                return (
                  <Box>
                    {index > 0 && <GreyBox sx={{ height: 8 }} />}
                    <Typography sx={{ ...text15B, mt: index === 0 ? 0 : 3 }}>
                      {format(temp, YMD_DAY_FORMAT, { locale: ko })}
                    </Typography>
                  </Box>
                );
              }
            };

            if (check.date === created) check.index += 1;
            else {
              check.index = 0;
              check.date = created;
            }
            return (
              <Box key={index}>
                <CreateDate />
                <Stack
                  direction={'row'}
                  spacing={1}
                  sx={{
                    py: 2,
                    borderTop: check.index === 0 ? 0 : 1,
                    borderColor: 'grey.200',
                  }}
                  onClick={() => handleClick(item)}
                >
                  {/* <Box sx={{ width: 80, height: 45, bgcolor: 'grey.600' }} /> */}
                  <Stack
                    spacing={1}
                    justifyContent={'center'}
                    sx={{ width: '100%' }}
                  >
                    <Typography sx={text14B}>{item.video_name}</Typography>
                    <Typography sx={{ ...text12, color: 'grey.800' }}>
                      {item.info}
                    </Typography>
                  </Stack>
                  <Stack spacing={1}>
                    <Typography sx={{ ...text12, color: 'grey.800' }}>
                      {fTimeIE(item.created)}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            );
          })}
      </Stack>
      <SearchDialog
        open={openSearch}
        setOpen={setOpenSearch}
        search={search}
        onClick={handleSearch}
      />
      <VideoDialog open={openVideo} setOpen={setOpenVideo} video={video} />
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
          top: 'calc(150% - 426px)',
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

export default MyVideo;
