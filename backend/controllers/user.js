const sanitize = require('mongo-sanitize');
const passwordValidator = require('password-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const schema = new passwordValidator;

schema
.is().min(8)
.has().uppercase()
.has().lowercase()
.has().digits()
.has().not().spaces()

exports.signup = (req, res) => {
    const email = sanitize(req.body.email);
    const password = sanitize(req.body.password);
    const buffer = Buffer.from(email);
    const maskedEmail = buffer.toString('base64');
    if (schema.validate(req.body.password)) {
        bcrypt.hash(password, 10)
        .then(hash => {
            const user = new User({
                email: maskedEmail,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: "Nouvel utilisateur créé" }))
                .catch(err => res.status(400).json({ err }));
        })
        .catch(err => res.status(500).json({ err }));
    } else {
        res.status(401).json({ error: "Le mot de passe doit contenir au minimum 8 caractères, comprendre au moins un caractère majuscule, un caractère minuscule et un chiffre et ne doit pas contenir d'espace" })
    }
};

exports.login = (req, res) => {
    const email = sanitize(req.body.email);
    const password = sanitize(req.body.password);
    const buffer = Buffer.from(email);
    const maskedEmail = buffer.toString('base64');
    User.findOne({ email: maskedEmail })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: "Utilisateur non trouvé" });
            }
            bcrypt.compare(password, user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({ error: "Mot de passe incorrect" });
                    } else {
                        res.status(200).json({
                            userId: user._id,
                            token: jwt.sign({ userId: user._id }, 'Gq8SZFSVIehzomW9QSjRUZ7Vlc5ykogXJMebbe3M', { expiresIn: '24h' })
                        });
                    }
                })
                .catch(err => res.status(500).json({ err }));
        })
        .catch(err => res.status(500).json({ err }));
};