// material
import { Button } from '@mui/material';
// config
import { text14 } from 'config/styles';

const TButton = ({
  label = '',
  variant = 'contained',
  color = 'tennis',
  disabled = false,
  onClick,
  sx = {},
}) => {
  return (
    <Button
      fullWidth
      color={color}
      variant={variant}
      disabled={disabled}
      sx={{
        height: 48,
        fontWeight: 500,
        borderRadius: 0,
        boxShadow: 0,
        ...text14,
        ...sx,
      }}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default TButton;
