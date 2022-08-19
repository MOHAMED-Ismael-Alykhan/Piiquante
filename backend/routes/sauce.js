const express = require('express');
//On importe le middleware
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
//On crée un router Express pour enregistrer nos routes. Le router Express est enregistré dans notre application
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');

/*********************** CREATION D'UNE SAUCE ********************/

router.post('/', auth, multer, sauceCtrl.createSauce);

/************************ MODIFICATION D'UNE SAUCE *************************/

router.put('/:id', auth, multer, sauceCtrl.modifySauce);

/************************ SUPPRESSION D'UNE SAUCE **************************/

router.delete(':id', auth, sauceCtrl.deleteSauce);

/************************ RECUPERATION D'UNE SAUCE *************************/

router.get('/:id', auth, sauceCtrl.getOneSauce);

/************************ RECUPERATION DES  SAUCES *************************/

router.get('/', auth, sauceCtrl.getAllSauces);

//On réexporte le router de ce fichier
module.exports = router;
