import { gql } from '@apollo/client';

export const PAYMENTS_QUERY = gql`
  query Programs($storeId: ID!, $memberId: ID!, $limit: Int!, $offset: Int!) {
    currentStoreId @client @export(as: "storeId")
    clt_payments(
      store_id: $storeId
      member_id: $memberId
      limit: $limit
      offset: $offset
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
