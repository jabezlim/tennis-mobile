import { gql } from '@apollo/client';

export const STORES_QUERY = gql`
  query GetStores {
    clt_stores {
      id
      name
    }
  }
`;
