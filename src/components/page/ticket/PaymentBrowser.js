import { useEffect, useState } from 'react';
// material
import { Table, TableBody, TableContainer } from '@mui/material';
// components
import { TableBodyRow, TableHeadCell } from 'components/ui/table';
import { Paginations } from 'components/ui/extended';
// config
import { PAY_TO, PAY_TYPE, PERIOD_TYPE } from 'config/constants';
// utils
import { fNumber } from 'utils/formatNumber';
import { fDateIE } from 'utils/formatDateTime';

const TABLE_HEAD = [
  { label: '카테고리', alignLeft: true },
  { label: '프로그램 명' },
  { label: '기간' },
  { label: '금액' },
  { label: '할인금액' },
  { label: '결제 타입' },
  { label: '구매' },
  { label: '결제일' },
];
const PaymentBrowser = ({ data, pagination, totalPage, handleChange }) => {
  // data
  const [payments, setPayments] = useState();
  const [tableBodyKeys, setTableBodyKeys] = useState();

  useEffect(() => {
    setTableBodyKeys([
      { id: 'category', alignLeft: true },
      { id: 'program_name' },
      { id: 'period_text' },
      { id: 'price_text' },
      { id: 'discount_text' },
      { id: 'paytype_text' },
      { id: 'payto_text' },
      { id: 'created', fn: fDateIE },
    ]);
  }, []);

  useEffect(() => {
    if (data) {
      setPayments(data);
    }
  }, [data]);

  return (
    <>
      <TableContainer>
        <Table>
          <TableHeadCell labels={TABLE_HEAD} />
          <TableBody>
            {payments &&
              payments.map((payment, index) => {
                let discountText = '';
                if (payment.discount && payment.discount > 0) {
                  discountText = `${fNumber(payment.discount)} 원`;
                }
                const data = {
                  ...payment,
                  price_text: `${fNumber(payment.price)} 원`,
                  discount_text: discountText,
                  period_text: `${payment.period} ${
                    PERIOD_TYPE[payment.period_type]
                  }`,
                  paytype_text: PAY_TYPE[payment.paytype] || '',
                  payto_text: PAY_TO[payment.payto] || '',
                };
                return (
                  <TableBodyRow keys={tableBodyKeys} data={data} key={index} />
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && (
        <Paginations totalPage={totalPage} handleChange={handleChange} />
      )}
    </>
  );
};

export default PaymentBrowser;
