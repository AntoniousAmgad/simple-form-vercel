// Simple CORS proxy for local development
// Usage: node proxy.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const TARGET = 'https://script.google.com';

// Add CORS headers for all requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Proxy everything under /proxy to script.google.com
app.use('/proxy', createProxyMiddleware({
  target: TARGET,
  changeOrigin: true,
  pathRewrite: function(path, req) {
    // remove the /proxy prefix
    return path.replace(/^\/proxy/, '');
  },
  onProxyReq: (proxyReq, req, res) => {
    // Optionally log
    // console.log('Proxying:', req.method, req.originalUrl);
  }
}));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Proxy listening on http://localhost:${PORT}`));
