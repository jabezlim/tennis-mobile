import { useEffect, useRef, useState } from 'react';
// material
import { Stack, TextField, Typography } from '@mui/material';
// config
import { ConfirmCodeBtn } from 'components/common';
import {
  textFieldInputProps,
  textFieldInputPropsSX,
  textFieldSX,
} from 'config/styles';

const EditFormField = ({
  label,
  autoFocus = false,
  type = 'text',
  value,
  btnLabel = '저장',
  onClick,
}) => {
  const inputRef = useRef();
  // data
  const [readOnly, setReadOnly] = useState(true);
  const [textValue, setTextValue] = useState('');
  const [showPassword, setShowPassword] = useState(
    type === 'password' ? false : true
  );

  useEffect(() => {
    if (value) setTextValue(value);
  }, [value]);

  useEffect(() => {
    if (!readOnly && autoFocus) {
      inputRef.current.focus();
    }
  }, [readOnly]);

  const handlePassword = () => {
    setShowPassword((show) => !show);
  };
  const handleEdit = () => {
    setReadOnly(false);
  };
  const handleClick = () => {
    setReadOnly(true);
    setShowPassword(type === 'password' ? false : true);
    if (onClick) onClick(textValue);
  };

  return (
    <Stack spacing={0.5}>
      {label && (
        <Typography sx={{ fontSize: 11, lineHeight: '11px' }}>
          {label}
        </Typography>
      )}
      <TextField
        fullWidth
        inputRef={inputRef}
        variant='outlined'
        color='black'
        type={showPassword ? 'text' : 'password'}
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        sx={textFieldSX}
        inputProps={textFieldInputProps}
        InputProps={{
          readOnly: readOnly,
          endAdornment: (
            <ConfirmCodeBtn
              readOnly={readOnly}
              type={type}
              handleEdit={handleEdit}
              showPassword={showPassword}
              handlePassword={handlePassword}
              btnLabel={btnLabel}
              handleClick={handleClick}
            />
          ),
          sx: textFieldInputPropsSX,
        }}
      />
    </Stack>
  );
};

export default EditFormField;
