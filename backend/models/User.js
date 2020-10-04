const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Création du modèle de données utilisateur
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Utilisation du plug-in 'mongoose-unique-validator' pour faciliter la gestion des erreurs
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);