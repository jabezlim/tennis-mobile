import { useEffect, useState } from 'react';
// material
import { Table, TableBody, TableContainer } from '@mui/material';
// components
import { TableBodyRow, TableHeadCell } from 'components/ui/table';
import { Paginations } from 'components/ui/extended';
// utils
import { fDateIE } from 'utils/formatDateTime';

const TABLE_HEAD = [
  { label: '파일명', alignLeft: true },
  { label: '파일 정보' },
  { label: '생성일' },
];
const VideoBrowser = ({
  data,
  pagination,
  totalPage,
  handleChange,
  handleClick,
}) => {
  // data
  const [videos, setVideos] = useState();
  const [tableBody, setTableBody] = useState([]);

  useEffect(() => {
    setTableBody([
      { id: 'video_name', alignLeft: true, cb: handleVideo },
      { id: 'info' },
      { id: 'created', fn: fDateIE },
    ]);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (data) {
      setVideos(data);
    }
  }, [data]);

  const handleVideo = (video) => {
    handleClick(video.video_url, video.video_name);
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHeadCell labels={TABLE_HEAD} />
          <TableBody>
            {videos &&
              videos.map((video, index) => {
                return (
                  <TableBodyRow keys={tableBody} data={video} key={index} />
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

export default VideoBrowser;
