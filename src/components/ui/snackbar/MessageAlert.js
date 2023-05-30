import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
// material
import { Snackbar } from '@mui/material';

const MessageAlert = forwardRef(({ color = '', message }, ref) => {
  // data
  const [open, setOpen] = useState(false);
  const [text, setText] = useState();

  useImperativeHandle(ref, () => ({
    open() {
      setOpen(true);
    },
  }));

  useEffect(() => {
    if (message) setText(message);
  }, [message]);

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      message={text}
      ContentProps={{
        sx: {
          display: 'block',
          textAlign: 'center',
          bgcolor: color,
        },
      }}
    />
  );
});

export default MessageAlert;
