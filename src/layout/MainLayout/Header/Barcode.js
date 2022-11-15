import { useNavigate } from 'react-router-dom';
// material
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase } from '@mui/material';
// icon
import { Icon } from '@iconify/react';
import barcodeScanner24Regular from '@iconify/icons-fluent/barcode-scanner-24-regular';
// config
import { path } from 'config/path';

const Barcode = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path.urls.memberBarcode);
  };

  return (
    <Box
      sx={{
        mx: { xs: 0.7, sm: 2, md: 3 },
      }}
    >
      <ButtonBase sx={{ borderRadius: '12px' }}>
        <Avatar
          variant='rounded'
          color='inherit'
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            transition: 'all .2s ease-in-out',
            background: theme.palette.secondary.light,
            color: theme.palette.secondary.dark,
            '&[aria-controls="menu-list-grow"],&:hover': {
              background: theme.palette.secondary.dark,
              color: theme.palette.secondary.light,
            },
          }}
          onClick={handleClick}
        >
          <Icon icon={barcodeScanner24Regular} />
        </Avatar>
      </ButtonBase>
    </Box>
  );
};

export default Barcode;
