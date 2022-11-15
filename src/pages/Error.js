// material
import { styled } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';

const ContentStyle = styled('section')({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center',
});

const Error = () => {
  return (
    <Container maxWidth='lg'>
      <ContentStyle>
        <Typography variant='h1' component='div' gutterBottom>
          ERROR...
        </Typography>
      </ContentStyle>
    </Container>
  );
};

export default Error;
