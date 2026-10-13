const BASE_URL = 'http://127.0.0.1:3000/api/products';
const TEST_PID = `CI-${require('node:crypto').randomUUID()}`;
function check(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function send(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    // Không có JSON
  }

  return { response, data };
}

async function runTests() {
  console.log('1. TEST CREATE PRODUCT');

  let result = await send(BASE_URL, {
    method: 'POST',
    body: JSON.stringify({
      pid: TEST_PID,
      pname: 'CI Product',
      price: 100000,
      quantity: 10
    })
  });

  check(result.response.status === 201, 'POST thất bại');
  console.log('CREATE PASSED');

  console.log('2. TEST GET ALL PRODUCTS');

  result = await send(BASE_URL);

  check(result.response.status === 200, 'GET ALL thất bại');
  check(
    result.data.data.some(product => product.pid === TEST_PID),
    'Không tìm thấy CI001'
  );

  console.log('GET ALL PASSED');

  console.log('3. TEST GET PRODUCT BY PID');

  result = await send(`${BASE_URL}/${TEST_PID}`);

  check(result.response.status === 200, 'GET BY PID thất bại');
  check(result.data.data.pid === TEST_PID, 'Sai pid');

  console.log('GET BY PID PASSED');

  console.log('4. TEST UPDATE PRODUCT');

  result = await send(`${BASE_URL}/${TEST_PID}`, {
    method: 'PUT',
    body: JSON.stringify({
      pname: 'CI Product Updated',
      price: 200000,
      quantity: 20
    })
  });

  check(result.response.status === 200, 'PUT thất bại');
  check(result.data.data.quantity === 20, 'Update quantity thất bại');

  console.log('UPDATE PASSED');

  console.log('5. TEST DELETE PRODUCT');

  result = await send(`${BASE_URL}/${TEST_PID}`, {
    method: 'DELETE'
  });

  check(result.response.status === 200, 'DELETE thất bại');

  console.log('DELETE PASSED');
  console.log('6. TEST GET DELETED PRODUCT');

result = await send(`${BASE_URL}/${TEST_PID}`);

check(
  result.response.status === 404,
  'Sản phẩm vẫn còn sau khi DELETE hoặc API trả sai mã trạng thái'
);

console.log('GET DELETED PRODUCT PASSED');
  console.log('ALL CRUD TESTS PASSED');
}

runTests().catch(error => {
  console.error('TEST FAILED:', error.message);
  process.exit(1);
});