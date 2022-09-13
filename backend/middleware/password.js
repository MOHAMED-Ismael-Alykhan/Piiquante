//On importe passwordSchema
const passwordSchema = require('../models/password');

//Vérification de la construction du password par rapport au schéma
module.exports = (req, res, next) => {
  if (passwordSchema.validate(req.body.password)) {
    next();
  } else {
    return res.status(400).json({
      message:
        "le password n'est pas assez fort et doit contenir 5 caractères au minimum, au moins une majuscule, une minuscule et deux chiffres au minimum et ne pas contenir d'espace.",
    });
  }
};
