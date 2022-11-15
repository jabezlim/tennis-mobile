// pay
import { Bootpay } from '@bootpay/client-js';
// config
import { CATEGORY_TYPE } from 'config/constants';
// helpers
import { gatAuthApp, getAuthUser } from 'helpers/storage';
// import { storeDataVar } from 'helpers/cache';

export const requestPayment = async (item) => {
  const params = {
    application_id: gatAuthApp(),
    price: Number(item.price),
    order_name: `${CATEGORY_TYPE[item.category_id]} - ${item.name}`,
    // order_id: `sid${storeDataVar().id}cid${item.category_id}pid${item.id}`,
    order_id: new Date().getTime(),
    // pg: '케이씨피',
    // method: '카드',
    user: {
      username: getAuthUser().name,
      phone: getAuthUser().contact,
    },
    extra: {
      // open_type: 'iframe', //'popup', //'iframe',
      card_quota: '0,2,3',
      // test_deposit: true,
      // show_close_button: true,
    },
  };

  // console.log(params);

  try {
    const response = await Bootpay.requestPayment(params);
    // switch (response.event) {
    //   case 'issued':
    //     // 가상계좌 입금 완료 처리
    //     break;
    //   case 'done':
    //     console.log(response);
    //     // 결제 완료 처리
    //     break;
    //   case 'confirm':
    //     //payload.extra.separately_confirmed = true; 일 경우 승인 전 해당 이벤트가 호출됨
    //     console.log(response.receipt_id);
    //     break;
    // }
    return { status: true, ...response };
  } catch (e) {
    // 결제 진행중 오류 발생
    // e.error_code - 부트페이 오류 코드
    // e.pg_error_code - PG 오류 코드
    // e.message - 오류 내용
    // console.log(e.message);
    // switch (e.event) {
    //   case 'cancel':
    //     // 사용자가 결제창을 닫을때 호출
    //     console.log(e.message);
    //     break;
    //   case 'error':
    //     // 결제 승인 중 오류 발생시 호출
    //     console.log(e.error_code);
    //     break;
    // }
    return { status: false, ...e };
  }
};
