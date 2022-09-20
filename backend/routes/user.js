const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const password = require('../middleware/password');
const checkEmail = require('../middleware/checkEmail');
const raterLimit = require('express-rate-limit');

// définition de la limitation de requetes
const limiter = raterLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // nombre d'essais
  message: 'trop de requêtes',
});

router.post('/signup', checkEmail, password, userCtrl.signup);
router.post('/login', limiter, userCtrl.login);

//On exporte le router
module.exports = router;
