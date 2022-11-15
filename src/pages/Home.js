import { useNavigate } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Button, Stack } from '@mui/material';
// components
import { MainCard } from 'components/ui/cards';
import Logo from 'components/ui/Logo';
// helper
import { removeAuthData } from 'helpers/storage';
// config
import { path } from 'config/path';
import { HOME_LIST } from 'config/constants';

const StyledButton = styled(Button)({
  fontSize: 24,
  paddingTop: 15,
  paddingBottom: 15,
});
const Home = () => {
  const navigate = useNavigate();

  const handleClick = (url) => {
    navigate(url);
  };
  const handleLogout = async () => {
    removeAuthData();
    navigate(path.urls.login);
  };

  return (
    <MainCard>
      <Stack spacing={3} sx={{ width: { md: 500 }, mb: 4 }}>
        <Box sx={{ textAlign: 'center', mt: 4, mb: 1 }}>
          <Logo ball />
        </Box>
        {HOME_LIST &&
          HOME_LIST.map((list, index) => {
            if (list.path) {
              return (
                <StyledButton
                  variant='contained'
                  color='tennis'
                  sx={{ borderRadius: 9, color: 'common.black' }}
                  onClick={() => handleClick(list.path)}
                  key={index}
                >
                  {list.label}
                </StyledButton>
              );
            } else {
              return (
                <StyledButton
                  variant='contained'
                  color='tennis'
                  sx={{ borderRadius: 9, color: 'common.black' }}
                  onClick={handleLogout}
                  key={index}
                >
                  {list.label}
                </StyledButton>
              );
            }
          })}
      </Stack>
    </MainCard>
  );
};

export default Home;
