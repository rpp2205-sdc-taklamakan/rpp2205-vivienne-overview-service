import http from 'k6/http';
import {check, sleep} from 'k6';

const only200CallBack = http.expectedStatuses(200);
http.setResponseCallback(only200CallBack);

export let options = {
  vus: 1000,
  duration: '1s'
}

export default function () {
  const BASE_URL = 'http://localhost:3002';
  var product_id = Math.floor((Math.random() * 10000) + 90000);
 
  const responses = http.batch([ 
    //['GET', `${BASE_URL}/products`]
  // ['GET', `${BASE_URL}/products/${product_id}`],
   ['GET', `${BASE_URL}/products/${product_id}/styles`]
]);

// check(responses[0], {
//   'GET /products':(r) => r.status === 200
// })
// check(responses[0], {
//   'GET /products/${product_id}':(r) => r.status === 200
// })
check(responses[0], {
  'GET /products/${product_id}/styles':(r) => r.status === 200
});
  sleep(1);
}