import { forwardRef } from 'react';
// components
import { DialogContainer } from 'components/page';

const MyBranch = forwardRef((_, ref) => {
  return (
    <DialogContainer ref={ref} title='내 지점'>
      MyBranch
    </DialogContainer>
  );
});

export default MyBranch;
