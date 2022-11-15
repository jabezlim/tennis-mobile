import { useNavigate } from 'react-router-dom';
// material
import { ButtonBase, useMediaQuery } from '@mui/material';
// context
import { useGlobalContext } from 'context';
// components
import Logo from 'components/ui/Logo';
// config
import { path } from 'config/path';

const LogoSection = () => {
  const navigate = useNavigate();
  const { settingMenu } = useGlobalContext();
  const matchesSM = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const handleClick = () => {
    if (matchesSM) settingMenu('set_menu', false);
    navigate(path.default);
  };

  return (
    <ButtonBase disableRipple onClick={handleClick} sx={{ mx: 'auto' }}>
      <Logo />
    </ButtonBase>
  );
};

export default LogoSection;
