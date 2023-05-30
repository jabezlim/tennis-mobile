import { useEffect, useState } from 'react';
// material
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
// config
import { EditIcon, VisibilityIcon, VisibilityOffIcon } from 'config/icons';

const EditFormField = ({
  label,
  autoFocus = false,
  type = 'text',
  placeholder = '',
  error,
  helperText,
  sx = {},
  isEdit,
  setIsEdit,
  editLabel = '저장',
  editOnClick,
  editBtn,
  ...props
}) => {
  // data
  const [textType, setTextType] = useState(type);
  const [isLabel, setIsLabel] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focus, setFocus] = useState(autoFocus);

  useEffect(() => {
    if (isEdit !== undefined) setIsLabel(isEdit);
  }, [isEdit]);

  const handleEdit = () => {
    setIsLabel(false);
    setFocus(true);
    if (setIsEdit) setIsEdit(!isEdit);
  };
  const handlePassword = () => {
    setShowPassword((show) => !show);
    setTextType(showPassword ? 'password' : 'text');
  };

  const visibility = () => {
    return (
      <InputAdornment position='end'>
        <IconButton onClick={handlePassword} edge='end'>
          {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </IconButton>
      </InputAdornment>
    );
  };
  const button = () => {
    return (
      <Stack
        justifyContent={'center'}
        alignItems={'center'}
        sx={{
          width: editLabel.length * 12 + 48,
          height: 24,
          bgcolor: 'common.white',
        }}
        onClick={editOnClick}
      >
        <Typography
          sx={{
            fontSize: 12,
            lineHeight: '12px',
          }}
        >
          {editLabel}
        </Typography>
      </Stack>
    );
  };

  return (
    <Stack spacing={0.5}>
      {label && (
        <Typography sx={{ fontSize: 11, lineHeight: '11px' }}>
          {label}
        </Typography>
      )}
      {isLabel && (
        <Stack
          direction={'row'}
          spacing={2}
          sx={{ backgroundColor: 'grey.100', padding: '15.5px 14px' }}
        >
          <Typography sx={{ width: '100%' }}>{props.value}</Typography>
          <EditIcon onClick={handleEdit} />
        </Stack>
      )}
      {isLabel === false && (
        <TextField
          fullWidth
          variant='outlined'
          color='black'
          autoFocus={focus}
          type={textType}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          {...props}
          sx={{
            '& fieldset': {
              borderRadius: 0,
              border: 0,
            },
            '& .Mui-error fieldset': {
              borderWidth: 2,
            },
            ...sx,
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
          InputProps={
            type === 'password'
              ? {
                  endAdornment: (
                    <>
                      {visibility()}
                      {!isEdit && <Box sx={{ width: 20 }} />}
                      {!isEdit && button()}
                    </>
                  ),
                  sx: { backgroundColor: 'grey.100', borderRadius: 0 },
                }
              : {
                  endAdornment: <>{!isEdit && button()}</>,
                  sx: { backgroundColor: 'grey.100', borderRadius: 0 },
                }
          }
        />
      )}
    </Stack>
  );
};

export default EditFormField;
