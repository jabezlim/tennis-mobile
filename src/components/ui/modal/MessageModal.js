// material
import { Typography } from '@mui/material';
// context
import { useGlobalContext } from 'context';
import FadeModal from './FadeModal';

const MessageModal = () => {
  const { message, settingMessage } = useGlobalContext();

  const handleOpenModal = (open) => {
    settingMessage('open', open);
  };

  return (
    <FadeModal
      closeBtn
      open={message.open}
      maxWidth={{ xs: '100%', sm: 500 }}
      setOpen={handleOpenModal}
    >
      <Typography variant='h4' sx={{ py: 2 }}>
        {message.message}
      </Typography>
    </FadeModal>
  );
};

export default MessageModal;
