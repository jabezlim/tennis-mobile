// icon
import bookClock20Filled from '@iconify/icons-fluent/book-clock-20-filled';
import { CATEGORIES } from 'config/constants';
// config
import { path } from 'config/path';

const ticket = {
  title: '정기권',
  caption: 'Ticket',
  type: 'group',
  icon: bookClock20Filled,
  children: [
    {
      id: 'ticket',
      title: '구매내역',
      type: 'item',
      url: path.urls.tickets,
    },
    {
      id: `ticket-${CATEGORIES[0].value}`,
      title: CATEGORIES[0].label,
      type: 'item',
      url: path.urls.ticketLesson,
    },
    {
      id: `ticket-${CATEGORIES[1].value}`,
      title: CATEGORIES[1].label,
      type: 'item',
      url: path.urls.ticketMachine,
    },
  ],
};

export default ticket;
