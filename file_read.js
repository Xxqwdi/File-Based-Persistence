const http = require('http');
const fs = require('fs');

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/data') {
    fs.readFile('data.json', 'utf8', (err, fileContent) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('Error or Invalid JSON');
      }

      try {
        JSON.parse(fileContent);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(fileContent);
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error or Invalid JSON');
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Сервер працює на порту ${port}`);
});