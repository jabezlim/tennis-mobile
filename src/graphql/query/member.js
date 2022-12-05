import { gql } from '@apollo/client';

export const MEMBER_QUERY = gql`
  query GetMember($memberId: ID!) {
    currentMemberId @client @export(as: "memberId")
    clt_member(member_id: $memberId) {
      name
      email
      contact
    }
  }
`;

export const MEMBER_TIMES_QUERY = gql`
  query GetMemberTimes($memberId: ID!) {
    currentMemberId @client @export(as: "memberId")
    clt_membertimes(member_id: $memberId) {
      time
      used_time
    }
  }
`;

export const MEMBER_VIDEOS_QUERY = gql`
  query GetMemberTimes(
    $storeId: ID!
    $memberId: ID!
    $limit: Int!
    $offset: Int!
  ) {
    currentStoreId @client @export(as: "storeId")
    currentMemberId @client @export(as: "memberId")
    clt_membervideos(
      store_id: $storeId
      member_id: $memberId
      limit: $limit
      offset: $offset
    ) {
      items {
        id
        video_url
        video_name
        info
        created
      }
      pageInfo {
        totalRow
        totalPage
      }
    }
  }
`;
