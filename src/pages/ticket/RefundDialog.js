import { forwardRef } from 'react';
// material
import { Box, Button, Dialog, Slide, Stack, Typography } from '@mui/material';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});
const RefundDialog = ({ open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      fullWidth
      open={open}
      // onClose={handleClose}
      TransitionComponent={Transition}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant='h4'>예약취소 및 환불규정</Typography>
        <Typography variant='h5' sx={{ mt: 3 }}>
          * 예약취소 및 환불규정은 다음과 같습니다.
        </Typography>
        <Typography variant='h5' sx={{ pl: 2 }}>
          (스크린 테니스 예약 취소 및 환불)
        </Typography>
        <Typography variant='h5' sx={{ pl: 2 }}>
          - 예약시간 기준 6시간 전 : 전액 환불
        </Typography>

        <Stack direction='row' justifyContent='flex-end' sx={{ mt: 2 }}>
          <Button
            variant='contained'
            color='error'
            sx={{
              fontSize: 14,
              borderRadius: 4.5,
              width: 100,
              height: 36,
              pt: 1,
            }}
            onClick={handleClose}
          >
            닫기
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default RefundDialog;
