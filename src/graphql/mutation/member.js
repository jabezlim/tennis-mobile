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
    currentMemberId @client @export(as: "memberId")
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

export const MEMBER_CONTACT_UPDATE_QUERY = gql`
  mutation MemberContactUpdate(
    $storeId: ID!
    $memberId: ID!
    $phone: String!
    $newPhone: String!
    $code: String!
  ) {
    currentStoreId @client @export(as: "storeId")
    currentMemberId @client @export(as: "memberId")
    clt_updatemembercontact(
      store_id: $storeId
      member_id: $memberId
      phone: $phone
      new_phone: $newPhone
      code: $code
    ) {
      status
      message
    }
  }
`;
