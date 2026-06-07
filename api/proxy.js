export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const target = 'https://script.google.com';
  try {
    // Forward path and query
    const path = req.url.replace(/^\/api/, '');
    const targetUrl = target + path;

    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json'
      },
      body: req.method === 'GET' || req.method === 'HEAD' ? undefined : req.body ? JSON.stringify(req.body) : undefined
    };

    const r = await fetch(targetUrl, fetchOptions);
    const text = await r.text();

    // Mirror status and body
    res.status(r.status).send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Proxy error' });
  }
}
