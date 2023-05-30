import { forwardRef } from 'react';
// components
import { DialogContainer } from 'components/page';

const MyLesson = forwardRef((_, ref) => {
  return (
    <DialogContainer ref={ref} title='찜한 레슨'>
      MyLesson
    </DialogContainer>
  );
});

export default MyLesson;
