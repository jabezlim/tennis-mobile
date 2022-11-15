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
