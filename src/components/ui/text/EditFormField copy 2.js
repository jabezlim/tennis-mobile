import { useEffect, useRef, useState } from 'react';
// material
import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
// config
import { EditIcon, VisibilityIcon, VisibilityOffIcon } from 'config/icons';
import { ConfirmCodeBtn } from 'components/common';

const Adornment = ({ onClick, children }) => {
  return (
    <InputAdornment position='end'>
      <IconButton onClick={onClick} edge='end'>
        {children}
      </IconButton>
    </InputAdornment>
  );
};
const EditFormField = ({
  label,
  autoFocus = false,
  type = 'text',
  value,
  isConfirm = false,
  btnLabel = '저장',
  onClick,
}) => {
  const inputRef = useRef();
  // data
  const [readOnly, setReadOnly] = useState(true);
  const [isCode, setIsCode] = useState(isConfirm);
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
    if (!isCode) {
      setReadOnly(true);
      setShowPassword(type === 'password' ? false : true);
    }
    if (isConfirm) setIsCode((code) => !code);
    if (onClick) onClick(textValue);
  };
  // const _editIcon = () => {
  //   return (
  //     <Adornment onClick={handleEdit}>
  //       <EditIcon />
  //     </Adornment>
  //   );
  // };
  // const _showPassword = () => {
  //   return (
  //     <Adornment onClick={handlePassword}>
  //       {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
  //     </Adornment>
  //   );
  // };
  // const _button = () => {
  //   return (
  //     <Stack
  //       justifyContent={'center'}
  //       alignItems={'center'}
  //       sx={{
  //         width: btnLabel.length * 12 + 48,
  //         height: 24,
  //         bgcolor: 'common.white',
  //       }}
  //       onClick={handleClick}
  //     >
  //       <Typography
  //         sx={{
  //           fontSize: 12,
  //           lineHeight: '12px',
  //         }}
  //       >
  //         {btnLabel}
  //       </Typography>
  //     </Stack>
  //   );
  // };
  // const _endAdornment = () => {
  //   if (readOnly) {
  //     return _editIcon();
  //   }
  //   if (type === 'password') {
  //     return (
  //       <>
  //         {_showPassword()}
  //         <Box sx={{ width: 20 }} />
  //         {_button()}
  //       </>
  //     );
  //   }
  //   return _button();
  // };

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
        sx={{
          '& fieldset': {
            borderRadius: 0,
            border: 0,
          },
          '& .Mui-error fieldset': {
            borderWidth: 2,
          },
        }}
        inputProps={{
          sx: {
            height: '1.215em',
            borderRadius: 0,
            backgroundColor: 'grey.100',
            '&::placeholder': {
              fontSize: 12,
              color: '#878787',
              lineHeight: '12px',
            },
          },
        }}
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
          sx: { backgroundColor: 'grey.100', borderRadius: 0 },
        }}
      />
    </Stack>
  );
};

export default EditFormField;
