const http = require('http');

const server = http.createServer((req, res) => {
    res.end('Le serveur fonctionne');
});

server.listen(process.env.PORT || 3000);