async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/products?limit=50');
    const json = await res.json();
    console.log('Total products returned:', json.data ? json.data.length : 'null');
    if (json.data && json.data.length > 0) {
      console.log('First 5 products:', json.data.slice(0, 5).map(p => ({ name: p.name, images: p.images })));
    } else {
      console.log('JSON keys:', Object.keys(json));
      console.log('Raw JSON:', json);
    }
  } catch (err) {
    console.error(err);
  }
}
test();
