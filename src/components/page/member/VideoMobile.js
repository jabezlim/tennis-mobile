import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
// material
import { Box, Divider, Stack, Typography } from '@mui/material';
// utils
import { fDateIE } from 'utils/formatDateTime';

const VideoMobile = ({ data, currentPage, handleScroll, handleClick }) => {
  // data
  const [videos, setVideos] = useState();

  useEffect(() => {
    if (data) {
      setVideos(data);
    }
  }, [data]);

  return (
    <InfiniteScroll
      pageStart={currentPage - 1}
      loadMore={handleScroll}
      hasMore={true || false}
      initialLoad={false}
    >
      <Stack spacing={2}>
        {videos &&
          videos.map((video, index) => {
            return (
              <Box key={index}>
                <Stack spacing={1}>
                  <Stack direction={'row'} justifyContent='space-between'>
                    <Typography
                      variant='h4'
                      onClick={() => handleClick(video)}
                      sx={{ textDecoration: 'underline' }}
                    >
                      {video.video_name}
                    </Typography>
                    <Typography variant='h5'>
                      {fDateIE(video.created)}
                    </Typography>
                  </Stack>
                  <Typography>{video.info}</Typography>
                </Stack>
                <Divider />
              </Box>
            );
          })}
      </Stack>
    </InfiniteScroll>
  );
};

export default VideoMobile;
