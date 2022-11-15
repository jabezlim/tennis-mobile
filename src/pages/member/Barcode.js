import QRCode from 'react-qr-code';
// material
import { Box, Typography } from '@mui/material';
// component
import { MainCard } from 'components/ui/cards';
// helper
import { getAuthBarcode } from 'helpers/storage';

const Barcode = () => {
  return (
    <MainCard darkTitle title='바코드'>
      <Box
        sx={{
          width: 220,
          height: 220,
          p: 1,
          mt: 3,
          mx: 'auto',
          border: 1,
        }}
      >
        <QRCode
          value={getAuthBarcode()}
          style={{ height: '100%', maxWidth: '100%', width: '100%' }}
          viewBox={`0 0 256 256`}
        />
      </Box>
      <Typography variant='h3' sx={{ mt: 2, textAlign: 'center' }}>
        {getAuthBarcode()}
      </Typography>
    </MainCard>
  );
};

export default Barcode;
