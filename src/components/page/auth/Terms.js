// material
import { Box, Typography } from '@mui/material';
// config
import { text12_21 } from 'config/styles';

const Terms = () => {
  return (
    <Box sx={{ px: 2 }}>
      <Typography sx={{ ...text12_21, fontWeight: 700 }}>
        [개인 정보 수집 동의]
      </Typography>
      <Typography sx={text12_21}>
        테니스 스쿼드에서는 고객의 서비스 이용을 위해 아래와 같은 최소한의
        개인정보를 수집하고 있습니다
      </Typography>
      <Typography sx={{ ...text12_21, fontWeight: 700, mt: 2 }}>
        1. 수집하는 개인정보의 항목
      </Typography>
      <Typography sx={{ ...text12_21, pl: 2 }}>휴대폰 번호</Typography>
      <Typography sx={{ ...text12_21, fontWeight: 700, mt: 2 }}>
        2. 개인정보의 수집 방법
      </Typography>
      <Typography sx={{ ...text12_21, pl: 2 }}>
        테니스의 스쿼드는 다음과 같은 방법으로 개인정보를 수집합니다. 테니스
        스쿼드 페이지에서 고객 확인
      </Typography>
      <Typography sx={{ ...text12_21, fontWeight: 700, mt: 2 }}>
        3. 개인정보의 수집 및 이용 목적
      </Typography>
      <Typography sx={{ ...text12_21, pl: 2 }}>
        개인정보의 수집은 아래와 같은 목적을 위하여 수집하며 이외의 목적으로는
        사용되지 않습니다.
        <br />- 서비스 이용을 위한 정보 활용
        {/* <br />- 포인트 제공을 위한 활용 */}
      </Typography>
      <Typography sx={{ ...text12_21, fontWeight: 700, mt: 2 }}>
        4. 개인정보의 보유 및 이용기간
      </Typography>
      <Typography sx={{ ...text12_21, pl: 2 }}>
        저장된 개인정보는 수집 및 이용목적이 달성되면 파기합니다
      </Typography>
      <Typography sx={{ ...text12_21, fontWeight: 700, mt: 2 }}>
        [개인 정보 제 3자 제공 안내]
      </Typography>
      <Typography sx={text12_21}>
        테니스 스쿼드는 수집된 정보를 제3자에게 제공하지 않습니다.
      </Typography>
      <Typography sx={{ ...text12_21, mt: 4 }}>
        * 동의를 거부 할 수 있으며, 동의 거부시 제공되는 서비스를 이용할 수
        없습니다.
      </Typography>
    </Box>
  );
};

export default Terms;
