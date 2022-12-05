import Hls from 'hls.js';
import { useEffect } from 'react';
// material
import { Box } from '@mui/material';
// components
import { FadeModal } from 'components/ui/modal';

const VideoModal = ({ open, setOpen, video }) => {
  useEffect(() => {
    if (video) {
      const timer = setTimeout(() => {
        const player = document.getElementById('player');
        if (player.canPlayType('application/vnd.apple.mpegurl')) {
          // First check for native browser HLS support
          player.src = video;
          player.addEventListener('loadedmetadata', function () {
            player.muted = true;
            player.play();
          });
        } else if (Hls.isSupported()) {
          // If no native HLS support, check if HLS.js is supported
          var hls = new Hls();
          hls.loadSource(video);
          hls.attachMedia(player);
          hls.on(Hls.Events.MANIFEST_PARSED, function () {
            // player.muted = true;
            // player.play();
          });
        }

        clearTimeout(timer);
      }, 100);
    }
  }, [video]);

  return (
    <FadeModal
      closeBtn
      open={open}
      setOpen={setOpen}
      maxWidth={{ xs: '100%', sm: 500 }}
    >
      <Box sx={{ pt: 3 }}>
        <video id='player' width='100%' height='auto' controls />
      </Box>
    </FadeModal>
  );
};

export default VideoModal;
