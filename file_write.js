const http = require('http');
const fs = require('fs');

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/data') {
    let body = '';

    // Збираємо дані по шматочках
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        JSON.parse(body);

        fs.writeFile('data.json', body, (err) => {
          if (err) {
            res.writeHead(500);
            return res.end('Помилка запису файлу');
          }
          res.writeHead(200);
          res.end();
        });
      } catch (error) {
        res.writeHead(400);
        res.end('Invalid JSON');
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(port);