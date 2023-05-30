import Hls from 'hls.js';
import { forwardRef, useEffect } from 'react';
// material
import { Dialog, Slide, Stack } from '@mui/material';
// config
import { CloseIcon } from 'config/icons';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});
const VideoDialog = ({ open, setOpen, video }) => {
  useEffect(() => {
    if (video) {
      const timer = setTimeout(() => {
        const player = document.getElementById('player');
        if (Hls.isSupported()) {
          var hls = new Hls();
          hls.loadSource(video);
          hls.attachMedia(player);
          hls.on(Hls.Events.MANIFEST_PARSED, function () {
            player.muted = true;
            player.play();
          });
        } else if (player.canPlayType('application/vnd.apple.mpegurl')) {
          player.src = video;
          player.addEventListener('loadedmetadata', function () {
            // player.muted = true;
            // player.play();
          });
        }

        clearTimeout(timer);
      }, 100);
    }
  }, [video]);

  return (
    <Dialog fullScreen open={open} TransitionComponent={Transition}>
      <CloseIcon
        sx={{ position: 'absolute', top: 24, right: 21 }}
        onClick={() => setOpen(false)}
      />
      <Stack justifyContent={'center'} sx={{ height: '100%' }}>
        <video id='player' width='100%' height='auto' controls />
      </Stack>
    </Dialog>
  );
};

export default VideoDialog;
