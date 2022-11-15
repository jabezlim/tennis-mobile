import { gql } from '@apollo/client';

export const BOOKINGS_QUERY = gql`
  query GetBookings(
    $memberId: ID!
    $limit: Int!
    $offset: Int!
    $type: String!
  ) {
    clt_bookings(
      member_id: $memberId
      limit: $limit
      offset: $offset
      type: $type
    ) {
      items {
        type
        store_name
        machine_program_name
        discount
        start_date
        start_time
        end_date
        end_time
        created
      }
      pageInfo {
        totalRow
        totalPage
      }
    }
  }
`;
