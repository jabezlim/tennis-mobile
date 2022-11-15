import { isEmpty } from 'lodash';
import { Stack, Typography, useTheme } from '@mui/material';
import { useReactiveVar } from '@apollo/client';
import { storeDataVar } from 'helpers/cache';
import { drawerWidth } from 'config/constants';

const Footer = ({ open }) => {
  const theme = useTheme();
  const storeData = useReactiveVar(storeDataVar);
  return (
    <Stack
      spacing={0.3}
      sx={{
        py: 4,
        px: { xs: 2, sm: 4 },
        ml: open ? `${drawerWidth}px` : 0,
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      {storeData && !isEmpty(storeData) && (
        <>
          <Typography sx={{ fontWeight: 700 }}>
            {storeData.site.name}
          </Typography>
          <Typography variant='caption'>{storeData.site.address}</Typography>
          <Typography variant='caption'>
            대표자 : {storeData.site.owner_name}
          </Typography>
          <Typography variant='caption'>T. {storeData.site.contact}</Typography>
          <Typography variant='caption'>
            사업자등록번호 : {storeData.site.business_no}
          </Typography>
          <Typography variant='caption'>
            통신판매신고번호 : {storeData.site.salse_no}
          </Typography>
        </>
      )}
    </Stack>
  );
};

export default Footer;
