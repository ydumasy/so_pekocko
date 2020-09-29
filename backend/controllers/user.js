const sanitize = require('mongo-sanitize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = (req, res) => {
    const email = sanitize(req.body.email);
    const password = sanitize(req.body.password);
    bcrypt.hash(password, 10)
        .then(hash => {
            const user = new User({
                email: email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: "Nouvel utilisateur créé" }))
                .catch(err => res.status(400).json({ err }));
        })
        .catch(err => res.status(500).json({ err }));
};

exports.login = (req, res) => {
    const email = sanitize(req.body.email);
    const password = sanitize(req.body.password);
    User.findOne({ email: email })
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