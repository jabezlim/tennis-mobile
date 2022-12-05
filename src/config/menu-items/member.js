// icon
import bookClock20Filled from '@iconify/icons-fluent/book-clock-20-filled';
// config
import { path } from 'config/path';

const member = {
  title: '회원',
  caption: 'Member',
  type: 'group',
  icon: bookClock20Filled,
  children: [
    {
      id: 'videos',
      title: '동영상',
      type: 'item',
      url: path.urls.memberVideos,
    },
  ],
};

export default member;
