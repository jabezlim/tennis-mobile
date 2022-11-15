import { Pagination, Stack } from '@mui/material';

const Paginations = ({ totalPage, handleChange }) => {
  return (
    <Stack alignItems='center' spacing={2} sx={{ mt: 5 }}>
      <Pagination
        count={totalPage}
        variant='outlined'
        color='tennis'
        shape='rounded'
        siblingCount={2}
        boundaryCount={1}
        onChange={handleChange}
      />
    </Stack>
  );
};

export default Paginations;
