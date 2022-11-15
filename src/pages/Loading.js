// material
import { styled } from '@mui/system';
import { CircularProgress, Stack } from '@mui/material';

const ContentStyle = styled('section')({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center',
});

const Circular = () => {
  return (
    <ContentStyle>
      <Stack sx={{ justifyContent: 'center' }} spacing={3} direction='row'>
        <CircularProgress thickness={7} color='error' />
        <CircularProgress thickness={7} color='warning' />
        <CircularProgress thickness={7} color='success' />
        <CircularProgress thickness={7} color='info' />
        <CircularProgress thickness={7} color='secondary' />
      </Stack>
    </ContentStyle>
  );
};

export default Circular;
