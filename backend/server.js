const http = require('http');
const app = require('./app');

// Définition du port utilisé
const port = process.env.PORT || 3000;
app.set('port', port);

// Gestion des différentes erreurs pouvant survenir lors de la connexion au serveur
const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

// Création du serveur
const server = http.createServer(app);
server.on('error', errorHandler);
server.on('listening', () => {
    address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

// Démarrage du serveur
server.listen(process.env.PORT || 3000);