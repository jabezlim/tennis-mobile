import { gql } from '@apollo/client';

export const PAYMENTS_QUERY = gql`
  query Programs(
    $storeId: ID!
    $memberId: ID!
    $limit: Int!
    $offset: Int!
    $search: String
  ) {
    currentStoreId @client @export(as: "storeId")
    clt_payments(
      store_id: $storeId
      member_id: $memberId
      limit: $limit
      offset: $offset
      search: $search
    ) {
      items {
        id
        category
        program_name
        barcode
        name
        member_phone
        period
        period_type
        price
        lesson_day
        discount
        created
        paytype
        payto
      }
      pageInfo {
        totalRow
        totalPage
      }
    }
  }
`;
