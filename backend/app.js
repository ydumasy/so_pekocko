const express = require('express');

const app = express();

app.use((req, res) => {
   res.json({ message: 'Le serveur fonctionne avec Express' }); 
});

module.exports = app;