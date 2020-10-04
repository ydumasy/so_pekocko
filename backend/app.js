const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
require('dotenv').config();

const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

// Création de l'application Express
const app = express();

// Connexion à la base de données
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/<dbname>?retryWrites=true&w=majority`,
{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Configuration des headers pour le CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Utilisation d'Helmet pour configurer les en-têtes HTTP
app.use(helmet());

// Utilisation de bodyParser pour extraire l'objet JSON de la réponse
app.use(bodyParser.json());

// Implémentations des routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);

module.exports = app;