import { forwardRef } from 'react';
import QRCode from 'react-qr-code';
// material
import { Box, Stack, Typography } from '@mui/material';
// components
import { DialogContainer } from 'components/page';
// helpers
import { getAuthBarcode, getAuthUser } from 'helpers/storage';
// config
import { text11, text12, text14 } from 'config/styles';

const CodeInfo = forwardRef((_, ref) => {
  return (
    <DialogContainer ref={ref} isFooter={false}>
      <Stack spacing={2} sx={{ textAlign: 'center', pt: 3.5 }}>
        <Typography sx={{ fontSize: 20, lineHeight: '20px', fontWeight: 700 }}>
          회원 QR 코드
        </Typography>
        <Typography sx={{ ...text12, color: 'text.grey' }}>
          지점 이용을 위해 QR 코드를 키오스크에 태그해 주세요.
        </Typography>
        <Stack sx={{ pt: 10 }}>
          <Box
            sx={{
              width: 220,
              height: 220,
              p: 1,
              border: 1,
              borderColor: '#BCBCBC',
              mx: 'auto',
            }}
          >
            <QRCode
              value={getAuthBarcode()}
              style={{ height: '100%', maxWidth: '100%', width: '100%' }}
              fgColor='#366122'
              viewBox={`0 0 256 256`}
            />
          </Box>
        </Stack>
        <Stack spacing={1}>
          <Typography sx={{ ...text14, fontWeight: 700 }}>
            {getAuthUser().name}
          </Typography>
          <Typography sx={{ ...text14, color: 'text.grey' }}>
            {getAuthBarcode()}
          </Typography>
          <Typography sx={{ color: 'text.grey', pt: 12, ...text11 }}>
            위 QR코드는 회원 개인의 고유 코드이며 타인에게의 양도를 금합니다.
          </Typography>
        </Stack>
      </Stack>
    </DialogContainer>
  );
});

export default CodeInfo;
