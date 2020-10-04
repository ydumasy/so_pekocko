const jwt = require('jsonwebtoken');

// Authentification de l'utilisateur par token
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'Gq8SZFSVIehzomW9QSjRUZ7Vlc5ykogXJMebbe3M');
        if (req.body.userId && req.body.userId !== decodedToken.userId) {
            throw "User ID invalide";
        } else {
            next();
        }
    } catch (err) {
        res.status(401).json({ error: err | "Requête non authentifiée" });
    }
}