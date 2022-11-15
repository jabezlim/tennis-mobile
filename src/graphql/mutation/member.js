import { gql } from '@apollo/client';

export const MEMBER_UPDATE_QUERY = gql`
  mutation MemberUpdate(
    $storeId: ID!
    $memberId: ID!
    $phone: String!
    $prevPhone: String
    $code: String
    $password: String
    $name: String
    $email: String
  ) {
    currentStoreId @client @export(as: "storeId")
    clt_updatemember(
      store_id: $storeId
      member_id: $memberId
      phone: $phone
      prev_phone: $prevPhone
      code: $code
      password: $password
      name: $name
      email: $email
    ) {
      status
      message
    }
  }
`;
