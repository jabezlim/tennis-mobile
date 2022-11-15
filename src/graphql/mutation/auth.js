import { gql } from '@apollo/client';

export const LOGIN_QUERY = gql`
  mutation Login($storeId: String!, $userId: String!, $password: String!) {
    clt_auth(store_id: $storeId, auth_id: $userId, auth_password: $password) {
      status
      message
      id
      app
      user_name
      user_contact
      user_email
      user_store
      user_barcode
      token
    }
  }
`;

export const CONFIRM_CODE_QUERY = gql`
  mutation ConfirmCode(
    $store: ID!
    $phone: String!
    $isMember: Boolean
    $prevPhone: String
  ) {
    clt_confirmcode(
      store_id: $store
      phone: $phone
      is_member: $isMember
      prev_phone: $prevPhone
    ) {
      status
      message
    }
  }
`;

export const REGISTER_QUERY = gql`
  mutation Register(
    $storeId: ID!
    $phone: String!
    $password: String!
    $code: String!
  ) {
    clt_register(
      store_id: $storeId
      phone: $phone
      password: $password
      code: $code
    ) {
      status
      message
    }
  }
`;

export const PASSWORD_INQUIRY_QUERY = gql`
  mutation Register($store: ID!, $phone: String!, $code: String!) {
    clt_password(store_id: $store, phone: $phone, code: $code) {
      status
      message
    }
  }
`;
