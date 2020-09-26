const express = require('express');
const saucesCtrl = require('../controllers/sauces');

const router = express.Router();

router.get('/', saucesCtrl.getAllSauces);
router.get('/:id', saucesCtrl.getOneSauce);

module.exports = router;