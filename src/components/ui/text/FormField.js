import { useState } from 'react';
// material
import { Stack, TextField, Typography } from '@mui/material';
// config
import { ConfirmCodeBtn } from 'components/common';
import {
  text11,
  textFieldInputProps,
  textFieldInputPropsSX,
  textFieldSX,
} from 'config/styles';

const FormField = ({
  label,
  autoFocus = false,
  type = 'text',
  placeholder = '',
  error,
  helperText,
  sx = {},
  btnLabel = '저장',
  onClick,
  ...props
}) => {
  // data
  const [textType, setTextType] = useState(type);
  const [showPassword, setShowPassword] = useState(false);

  const handlePassword = () => {
    setShowPassword((show) => !show);
    setTextType(showPassword ? 'password' : 'text');
  };
  const handleClick = () => {
    onClick(props.value);
  };

  return (
    <Stack spacing={0.5}>
      {label && <Typography sx={text11}>{label}</Typography>}
      <TextField
        fullWidth
        variant='outlined'
        color='black'
        autoFocus={autoFocus}
        type={textType}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        {...props}
        sx={{ ...textFieldSX, ...sx }}
        inputProps={textFieldInputProps}
        InputProps={{
          endAdornment: (
            <ConfirmCodeBtn
              type={type}
              showPassword={showPassword}
              handlePassword={handlePassword}
              btnLabel={btnLabel}
              handleClick={onClick && handleClick}
            />
          ),
          sx: textFieldInputPropsSX,
        }}
      />
    </Stack>
  );
};

export default FormField;
