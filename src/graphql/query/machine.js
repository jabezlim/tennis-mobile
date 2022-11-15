import { gql } from '@apollo/client';

export const MACHINES_QUERY = gql`
  query GetMachines($storeId: ID!) {
    clt_machines(store_id: $storeId) {
      id
      name
    }
  }
`;

export const MACHINE_LESSON_QUERY = gql`
  query GetMachineLesson($storeId: ID!) {
    clt_machinelesson(store_id: $storeId) {
      machine_id
      program_id
      day
      time
      book_lesson_date
    }
  }
`;

export const MACHINE_BOOKED_QUERY = gql`
  query GetMachineBooked($storeId: ID!, $date: String!) {
    clt_machinebooked(store_id: $storeId, date: $date) {
      machine_id
      start_date
      start_time
      end_date
      end_time
    }
  }
`;
