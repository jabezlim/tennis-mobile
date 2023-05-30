import { gql } from '@apollo/client';

export const BOOKINGS_QUERY = gql`
  query GetBookings($memberId: ID!, $limit: Int!, $offset: Int!) {
    clt_bookings(member_id: $memberId, limit: $limit, offset: $offset) {
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

export const BOOKINGS_TYPE_QUERY = gql`
  query GetNextBookings(
    $memberId: ID!
    $limit: Int!
    $offset: Int!
    $type: String!
  ) {
    clt_bookings_type(
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
