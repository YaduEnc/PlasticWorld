const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8081;
const htmlFilePath = path.join(__dirname, 'test-user-api.html');

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/test-user-api.html') {
    fs.readFile(htmlFilePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading HTML file.');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`✅ Test page server running at http://localhost:${port}`);
  console.log(`📄 Open http://localhost:${port} in your browser to test User Profile API`);
});
