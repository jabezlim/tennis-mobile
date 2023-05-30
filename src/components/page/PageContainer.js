import { useRef } from 'react';
// material
import { Box, Container, Stack, Typography } from '@mui/material';
// components
// config
import { PersonIcon, TennisSquadIcon } from 'config/icons';
import { text18B } from 'config/styles';
// pages
import MyPage from 'pages/mypage/MyPage';

const PageContainer = ({ label, children }) => {
  const mypageRef = useRef();

  const handleNavigate = (path) => {
    if (path === 'my-page') mypageRef.current.open();
  };

  return (
    <Container sx={{ p: 0 }}>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        sx={{
          height: 56,
          mt: 2,
          p: 2,
          borderBottom: label ? 1 : 0,
          borderColor: 'grey.200',
        }}
      >
        {label && <Typography sx={text18B}>{label}</Typography>}
        {!label && <TennisSquadIcon />}
        <Stack direction={'row'} spacing={2}>
          {/* <ShoppingCartIcon /> */}
          <Box sx={{ pt: 0.3 }}>
            <PersonIcon onClick={() => handleNavigate('my-page')} />
          </Box>
        </Stack>
      </Stack>
      <Box sx={{ px: 2, pt: label ? 3 : 0 }}>{children}</Box>
      <MyPage ref={mypageRef} />
      {/* <BackToTop /> */}
    </Container>
  );
};

export default PageContainer;
