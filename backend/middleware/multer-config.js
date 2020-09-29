const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}-${file.originalname.split(' ').join('_')}`);
    }
});

module.exports = multer({ storage }).single('image');