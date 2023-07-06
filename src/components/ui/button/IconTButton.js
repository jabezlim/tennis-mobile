// material
import { Button, Stack, Typography } from '@mui/material';
// config
import { text12 } from 'config/styles';

const IconTButton = ({
  label = '',
  color = 'tennis',
  variant = 'contained',
  disabled = false,
  onClick,
  sx = {},
  direction = 'column',
  alignItems = 'center',
  justifyContent = 'center',
  icon,
  labelSX = {},
}) => {
  return (
    <Button
      fullWidth
      color={color}
      variant={variant}
      disabled={disabled}
      sx={{ borderRadius: 0, boxShadow: 0, p: 0, ...sx }}
      onClick={onClick}
    >
      <Stack
        spacing={1}
        direction={direction}
        alignItems={alignItems}
        justifyContent={justifyContent}
        sx={{ width: '100%' }}
      >
        <Stack
          justifyContent={'center'}
          alignItems={'center'}
          sx={{ width: 24, height: 24 }}
        >
          {icon}
        </Stack>
        <Typography sx={{ ...text12, ...labelSX }}>{label}</Typography>
      </Stack>
    </Button>
  );
};

export default IconTButton;
