const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');

require('dotenv').config();

const app = express();

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/<dbname>?retryWrites=true&w=majority`,
{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use('/api/auth', userRoutes);

module.exports = app;