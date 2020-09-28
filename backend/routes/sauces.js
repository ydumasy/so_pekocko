const express = require('express');
const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const router = express.Router();

router.get('/', auth, saucesCtrl.getSauces);
router.get('/:id', auth, saucesCtrl.getSauceById);
router.post('/', auth, multer, saucesCtrl.createSauce);
router.post('/:id/like', auth, saucesCtrl.likeSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, multer, saucesCtrl.deleteSauce);

module.exports = router;