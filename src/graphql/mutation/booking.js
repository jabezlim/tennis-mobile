import { gql } from '@apollo/client';

export const BOOK_QUERY = gql`
  mutation Booking(
    $storeId: ID!
    $machineId: ID!
    $memberId: ID!
    $barcode: String!
    $discount: Int!
    $day: String!
    $times: String!
    $startDate: String!
    $startTime: String!
    $endDate: String!
    $endTime: String!
    $usedTime: Int!
    $period: Int!
  ) {
    clt_booking(
      store_id: $storeId
      machine_id: $machineId
      member_id: $memberId
      barcode: $barcode
      discount: $discount
      day: $day
      times: $times
      start_date: $startDate
      start_time: $startTime
      end_date: $endDate
      end_time: $endTime
      used_time: $usedTime
      period: $period
    ) {
      status
      message
    }
  }
`;
