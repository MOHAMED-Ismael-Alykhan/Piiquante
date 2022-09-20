//On importe password-validator
const passwordValidator = require('password-validator');

// Création du schéma
const passwordSchema = new passwordValidator();

// Le schéma que doit respecter le mot de passe
passwordSchema
  .is()
  .min(8) // Longueur minimum de caractères (8)
  .is()
  .max(100) // Longueur maximum de caractères (100)
  .has()
  .uppercase() // Doit avoir une lettre majuscule
  .has()
  .lowercase() // Doit avoir une lettre minuscule
  .has()
  .digits(2) // Doit avoir au moins deux chiffres
  .has()
  .not()
  .spaces() // Aucun espace
  .is()
  .not()
  .oneOf(['Passw0rd', 'Password123']); // Blacklist des valeurs

module.exports = passwordSchema;
