#!/usr/bin/env node

// Simple HTTP server to serve the Firebase token HTML page
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const HTML_FILE = path.join(__dirname, 'get-firebase-token.html');

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/get-firebase-token.html') {
    fs.readFile(HTML_FILE, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error reading file: ' + err.message);
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`✅ Firebase Token Page Server running at:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`\n📝 Open this URL in your browser to get your Firebase ID token`);
  console.log(`\nPress Ctrl+C to stop the server`);
});
