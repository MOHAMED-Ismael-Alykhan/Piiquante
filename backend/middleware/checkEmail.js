//On importe validator
const validator = require('validator');

//Vérification de la validité de l'Email
module.exports = (req, res, next) => {
  const { email } = req.body;

  if (validator.isEmail(email)) {
    console.log(`email valide ${validator.isEmail(email)}`);
    next();
  } else {
    return res.status(400).json({ error: `l'email ${email} n'est pas valide` });
  }
};
