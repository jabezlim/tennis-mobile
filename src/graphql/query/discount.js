import { gql } from '@apollo/client';

export const DISCOUNT_SCHEDULE_QUERY = gql`
  query GetDiscountSchedule($storeId: ID!) {
    clt_discountschedule(store_id: $storeId) {
      day
      time
      discount
    }
  }
`;
