import { useEffect, useState } from 'react';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from 'react-device-detect';
import { concat, endsWith } from 'lodash';
// graphql
import { useLazyQuery } from '@apollo/client';
import { MEMBER_VIDEOS_QUERY } from 'graphql/query';
// component
import { MainCard } from 'components/ui/cards';
import { VideoBrowser, VideoMobile, VideoModal } from 'components/page/member';
// util
import { scrollToTop } from 'utils/util';
// pages
import LoadingPage from 'pages/Loading';
import ErrorPage from 'pages/Error';

const LIST_LIMIT = 20;
const Video = () => {
  // data
  const [items, setItems] = useState();
  const [totalPage, setTotalPage] = useState(0);
  const [totalRow, setTotalRow] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [video, setVideo] = useState();
  // graphql
  const [getVideos, { loading, error, fetchMore }] = useLazyQuery(
    MEMBER_VIDEOS_QUERY,
    {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-first',
      onCompleted: (data) => {
        if (data.clt_membervideos) {
          if (isBrowser) {
            setItems(data.clt_membervideos.items);
          } else {
            if (currentPage === 1) {
              setItems(data.clt_membervideos.items);
            } else {
              setItems(concat(items, data.clt_membervideos.items));
            }
          }

          if (totalPage !== data.clt_membervideos.pageInfo.totalPage) {
            setTotalPage(data.clt_membervideos.pageInfo.totalPage);
          }
          if (totalRow !== data.clt_membervideos.pageInfo.totalRow) {
            setTotalRow(data.clt_membervideos.pageInfo.totalRow);
          }
        }
      },
    }
  );

  useEffect(() => {
    getVideos({ variables: { limit: LIST_LIMIT, offset: 0 } });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (items && isBrowser) {
      scrollToTop();
    }
  }, [items]);

  useEffect(() => {
    if (!open) setVideo();
  }, [open]);

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
  const handleClickVideo = (video) => {
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
    setVideo(video_url);
    setOpen(true);
  };

  return (
    <MainCard darkTitle title='동영상'>
      <BrowserView>
        <VideoBrowser
          data={items}
          pagination={totalPage > 0 && totalRow > LIST_LIMIT}
          totalPage={totalPage}
          handleChange={handleChangePage}
          handleClick={handleClickVideo}
        />
      </BrowserView>
      <MobileView>
        <VideoMobile
          data={items}
          currentPage={currentPage}
          handleScroll={handleInfiniteScroll}
          handleClick={handleClickVideo}
        />
      </MobileView>
      <VideoModal open={open} setOpen={setOpen} video={video} />
    </MainCard>
  );
};

export default Video;
