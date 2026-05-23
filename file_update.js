const http = require('http');
const fs = require('fs');

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
  const urlParts = req.url.split('/');

  if (req.method === 'PUT' && urlParts[1] === 'data' && urlParts.length === 3) {
    const targetId = urlParts[2];
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      let updatedData;
      
      try {
        updatedData = JSON.parse(body);
      } catch (err) {
        res.writeHead(400);
        return res.end('Invalid JSON');
      }

      fs.readFile('data.json', 'utf8', (err, fileContent) => {
        if (err) {
          res.writeHead(500);
          return res.end('File missing or cannot be read');
        }

        let dataArray;
        try {
          dataArray = JSON.parse(fileContent);
        } catch (err) {
          res.writeHead(500);
          return res.end('Invalid JSON in data.json');
        }


        const itemIndex = dataArray.findIndex(item => String(item.id) === targetId);

        if (itemIndex === -1) {
          res.writeHead(404);
          return res.end('Not Found');
        }

        const originalId = dataArray[itemIndex].id;
        dataArray[itemIndex] = { ...dataArray[itemIndex], ...updatedData, id: originalId };

        fs.writeFile('data.json', JSON.stringify(dataArray), (writeErr) => {
          if (writeErr) {
            res.writeHead(500);
            return res.end('Error writing file');
          }
          res.writeHead(200);
          res.end();
        });
      });
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(port);