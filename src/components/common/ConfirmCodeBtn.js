// material
import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
// config
import { text12 } from 'config/styles';
import { EditIcon, VisibilityIcon, VisibilityOffIcon } from 'config/icons';

const Adornment = ({ onClick, children }) => {
  return (
    <InputAdornment position='end'>
      <IconButton onClick={onClick} edge='end'>
        {children}
      </IconButton>
    </InputAdornment>
  );
};
const ConfirmCodeBtn = ({
  readOnly,
  type = 'text',
  handleEdit,
  showPassword,
  handlePassword,
  btnLabel = '저장',
  handleClick,
}) => {
  const _editIcon = () => {
    return (
      <Adornment onClick={handleEdit}>
        <EditIcon />
      </Adornment>
    );
  };
  const _showPassword = () => {
    return (
      <Adornment onClick={handlePassword}>
        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
      </Adornment>
    );
  };
  const _button = () => {
    if (handleClick) {
      return (
        <Stack
          justifyContent={'center'}
          alignItems={'center'}
          sx={{
            width: btnLabel.length * 12 + 48,
            height: 24,
            bgcolor: 'common.white',
          }}
          onClick={handleClick}
        >
          <Typography sx={text12}>{btnLabel}</Typography>
        </Stack>
      );
    }
    return <></>;
  };

  if (readOnly) {
    return _editIcon();
  }
  if (type === 'password') {
    return (
      <>
        {_showPassword()}
        <Box sx={{ width: 20 }} />
        {_button()}
      </>
    );
  }
  return _button();
};

export default ConfirmCodeBtn;
