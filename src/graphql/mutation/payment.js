import { gql } from '@apollo/client';

export const PAY_QUERY = gql`
  mutation Payment(
    $storeId: ID!
    $storeName: String!
    $memberId: ID!
    $categoryId: ID!
    $instructorId: ID
    $memberName: String
    $instructorName: String
    $lessonType: String
    $barcode: String
    $category: String!
    $termid: String
    $cardtype: String
    $cardno: String
    $cardQuota: String
    $appno: String
    $saledate: String
    $saletime: String
    $paytype: Int
    $installment: Int
    $phone: String!
    $programName: String!
    $period: String!
    $periodType: String!
    $price: String!
    $priceType: String
    $dates: String
    $lesson: String
    $cardReceiptUrl: String
    $receiptId: String!
    $receiptUrl: String
    $receiptStatus: Int!
    $receiptPrice: Int!
  ) {
    clt_payment(
      store_id: $storeId
      store_name: $storeName
      member_id: $memberId
      category_id: $categoryId
      instructor_id: $instructorId
      member_name: $memberName
      instructor_name: $instructorName
      lesson_type: $lessonType
      barcode: $barcode
      category: $category
      termid: $termid
      cardtype: $cardtype
      cardno: $cardno
      card_quota: $cardQuota
      appno: $appno
      saledate: $saledate
      saletime: $saletime
      paytype: $paytype
      installment: $installment
      member_phone: $phone
      program_name: $programName
      period: $period
      period_type: $periodType
      price: $price
      price_type: $priceType
      dates: $dates
      lesson: $lesson
      card_receipt_url: $cardReceiptUrl
      receipt_id: $receiptId
      receipt_url: $receiptUrl
      receipt_status: $receiptStatus
      receipt_price: $receiptPrice
    ) {
      status
      message
      barcode
      payment
    }
  }
`;

export const PAY_CANCEL_QUERY = gql`
  mutation PaymentCancel($storeId: ID!, $paymentId: ID!) {
    cancelpayment(store_id: $storeId, payment_id: $paymentId) {
      status
      message
    }
  }
`;
