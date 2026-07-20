async function triggerLiveUpdate() {
  const url = 'https://server-tau-taupe-45.vercel.app/api/orders/9d749dd4-0414-44dd-bb8d-85b826a7848b/status';
  console.log('Sending PUT request to:', url);
  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'packed', tracking_number: 'TRK-SUCCESS-9d749dd4' })
    });
    
    console.log('Status Code:', response.status);
    const data = await response.json();
    console.log('Response Body:', data);
  } catch (err) {
    console.error('Error:', err);
  }
}

triggerLiveUpdate();
