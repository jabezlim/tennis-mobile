import { isEmpty } from 'lodash';
// material
import { Stack, Typography } from '@mui/material';
// graphql
import { useReactiveVar } from '@apollo/client';
// helpers
import { storeDataVar } from 'helpers/cache';
// config
import { text11, text12B } from 'config/styles';

const textStyle = {
  ...text11,
  color: 'grey.400',
};
const Info = ({ sx = {} }) => {
  const storeData = useReactiveVar(storeDataVar);

  if (storeData && !isEmpty(storeData)) {
    return (
      <Stack spacing={1} sx={{ py: 2, ...sx }}>
        <Typography sx={{ ...text12B, color: 'grey.800' }}>
          {storeData.site.name}
        </Typography>
        <Stack spacing={0.7}>
          <Typography sx={textStyle}>{storeData.site.address}</Typography>
          <Typography sx={textStyle}>
            대표자 : {storeData.site.owner_name}
          </Typography>
          <Typography sx={textStyle}>T. {storeData.site.contact}</Typography>
          <Typography sx={textStyle}>
            사업자등록번호 : {storeData.site.business_no}
          </Typography>
          <Typography sx={textStyle}>
            통신판매신고번호 : {storeData.site.salse_no}
          </Typography>
        </Stack>
      </Stack>
    );
  }
  return <></>;
};

export default Info;
