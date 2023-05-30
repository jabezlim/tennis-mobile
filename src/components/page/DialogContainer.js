import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
// material
import { Box, Container, Dialog, Stack, Typography } from '@mui/material';
// config
import { text18B } from 'config/styles';
import { ArrowBackIcon } from 'config/icons';
// layout
import { Footer } from 'layout';

const DialogContainer = forwardRef(
  (
    {
      title,
      children,
      isFooter = true,
      scroll = { start: 0, loadMore: () => {}, hasMore: false },
      handleOpen,
    },
    ref
  ) => {
    // data
    const [open, setOpen] = useState(false);
    const [isDialog, setIsDialog] = useState(false);

    useImperativeHandle(ref, () => ({
      open() {
        setOpen(true);
      },
    }));

    useEffect(() => {
      setIsDialog(open);
      if (handleOpen) handleOpen(open);
      // eslint-disable-next-line
    }, [open]);

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <Dialog fullScreen open={open}>
        <Container sx={{ p: 0 }}>
          <Stack
            direction={'row'}
            spacing={1}
            alignItems={'center'}
            sx={{
              height: 56,
              mt: 2,
              p: 2,
              borderBottom: 1,
              borderColor: 'grey.200',
            }}
          >
            <ArrowBackIcon onClick={handleClose} />
            <Typography sx={{ ...text18B, pt: 0.5 }}>{title}</Typography>
          </Stack>
        </Container>
        <InfiniteScroll
          pageStart={scroll.start}
          loadMore={scroll.loadMore}
          hasMore={scroll.hasMore}
          useWindow={false}
          initialLoad={false}
        >
          <Container sx={{ p: 0 }}>
            <Box sx={{ px: 2, pt: 3 }}>{children}</Box>
          </Container>
        </InfiniteScroll>
        {isFooter && <Box sx={{ pt: 7 }} />}
        {isFooter && <Footer isDialog={isDialog} />}
      </Dialog>
    );
    // return (
    //   <Dialog fullScreen open={open}>
    //     <Container sx={{ p: 0 }}>
    //       <Stack
    //         direction={'row'}
    //         spacing={1}
    //         alignItems={'center'}
    //         sx={{
    //           height: 56,
    //           mt: 2,
    //           p: 2,
    //           borderBottom: 1,
    //           borderColor: 'grey.200',
    //         }}
    //       >
    //         <ArrowBackIcon onClick={handleClose} />
    //         <Typography sx={{ ...text18B, pt: 0.5 }}>{title}</Typography>
    //       </Stack>
    //       <Box sx={{ px: 2, pt: 3 }}>{children}</Box>
    //       {isFooter && <Box sx={{ pt: 7 }} />}
    //       {isFooter && <Footer isDialog={isDialog} />}
    //     </Container>
    //   </Dialog>
    // );
  }
);

export default DialogContainer;
