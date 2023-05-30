import { forwardRef } from 'react';
// components
import { DialogContainer } from 'components/page';

const MyPoint = forwardRef((_, ref) => {
  // page open
  const handleOpen = (open) => {
    if (open) {
      // getMember();
    }
  };

  return (
    <DialogContainer ref={ref} title='내 포인트' handleOpen={handleOpen}>
      MyPoint
    </DialogContainer>
  );
});

export default MyPoint;
