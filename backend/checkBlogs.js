// Uses native fetch (Node 18+) to avoid extra dependencies.

(async () => {
  try {
    const res = await fetch('http://127.0.0.1:5000/api/blogs');
    const data = await res.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error fetching /api/blogs:', err.message || err);
    process.exit(1);
  }
})();
