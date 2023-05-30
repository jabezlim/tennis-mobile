import { Stack } from '@mui/material';

const GreyBox = ({ sx = {}, children, ...props }) => {
  return (
    <Stack sx={{ bgcolor: 'grey.100', mx: -2, ...sx }} {...props}>
      {children}
    </Stack>
  );
};

export default GreyBox;
