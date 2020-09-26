const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_SECRET_KEY');
        if (req.body.userId && req.body.userId !== decodedToken.userId) {
            throw "User ID invalide";
        } else {
            next();
        }
    } catch (err) {
        res.status(401).json({ error: err | "Requête non authentifiée"});
    }
}