const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const password = require('../middleware/password');
const checkEmail = require('../middleware/checkEmail');

router.post('/signup', checkEmail, password, userCtrl.signup);
router.post('/login', userCtrl.login);

//On exporte le router
module.exports = router;
