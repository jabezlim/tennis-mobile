import { gql } from '@apollo/client';

export const MEMBER_UPDATE_QUERY = gql`
  mutation MemberUpdate(
    $storeId: ID!
    $memberId: ID!
    $password: String
    $name: String
    $email: String
  ) {
    currentStoreId @client @export(as: "storeId")
    clt_updatemember(
      store_id: $storeId
      member_id: $memberId
      password: $password
      name: $name
      email: $email
    ) {
      status
      message
    }
  }
`;
