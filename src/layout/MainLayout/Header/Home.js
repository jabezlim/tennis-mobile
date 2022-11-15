import { useNavigate } from 'react-router-dom';
// material
import { IconButton } from '@mui/material';
// icon
import { Icon } from '@iconify/react';
import homeOutline from '@iconify/icons-eva/home-outline';
// config
import { path } from 'config/path';

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path.urls.home);
  };

  return (
    <IconButton
      onClick={handleClick}
      sx={{ color: 'tennis.dark', p: 0, mr: 1 }}
    >
      <Icon icon={homeOutline} width='25' />
    </IconButton>
  );
};

export default Home;
