import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
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

const EditFormField = forwardRef(
  (
    {
      label,
      autoFocus = true,
      type = 'text',
      placeholder = '',
      error,
      helperText,
      btnLabel = '저장',
      onClick,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef();
    // data
    const [readOnly, setReadOnly] = useState(true);
    const [showPassword, setShowPassword] = useState(
      type === 'password' ? false : true
    );

    useImperativeHandle(ref, () => ({
      readOnlyToggle(read) {
        setReadOnly(read);
      },
    }));

    useEffect(() => {
      if (!readOnly && autoFocus) {
        inputRef.current.focus();
      }
      // eslint-disable-next-line
    }, [readOnly]);

    const handlePassword = () => {
      setShowPassword((show) => !show);
    };
    const handleEdit = () => {
      setReadOnly(false);
    };
    const handleClick = () => {
      setShowPassword(type === 'password' ? false : true);
      if (onClick) onClick();
    };

    return (
      <Stack spacing={0.5}>
        {label && <Typography sx={text11}>{label}</Typography>}
        <TextField
          fullWidth
          inputRef={inputRef}
          variant='outlined'
          color='black'
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          {...props}
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
  }
);

export default EditFormField;
