import { gql } from '@apollo/client';

export const PROGRAMS_QUERY = gql`
  query Programs($storeId: ID!, $categoryId: ID!) {
    currentStoreId @client @export(as: "storeId")
    clt_programs(store_id: $storeId, category_id: $categoryId) {
      id
      user_id
      category_id
      name
      user_name
      user_image
      machine_name
      period
      period_type
      price
      lesson_type
      lesson_limit
      lesson_day
      lesson_start_date
      lesson_start_time
      lesson_end_time
      menu_type
      sort
    }
  }
`;

export const PROGRAM_LESSON_BOOKED_QUERY = gql`
  query ProgramLessonBooked($storeId: ID!, $programId: ID!) {
    currentStoreId @client @export(as: "storeId")
    clt_programlessonbooked(store_id: $storeId, program_id: $programId) {
      program_id
      members
      day
      date
      booked
      limit
    }
  }
`;
