const testUpdate = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/orders/ORD-0921/status', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'shipped', tracking_number: 'TRK-SCRATCH' })
    });
    console.log('Status Code:', response.status);
    const data = await response.json();
    console.log('Response Body:', data);
  } catch (err) {
    console.error('Error:', err);
  }
};

testUpdate();
