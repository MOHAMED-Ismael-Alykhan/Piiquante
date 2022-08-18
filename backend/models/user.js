//On importe mongoose
const mongoose = require('mongoose');
//On importe mongoose-unique-validator pour prévalider les informations avant de les enregistrer.
const uniqueValidator = require('mongoose-unique-validator');

//On crée notre schéma
const userSchema = mongoose.Schema({
  //On utilise le mot clé unique pour s'assurer que deux utilisateurs n'utilisent pas la même adresse email
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// On s'assure que deux utilisateurs ne puissent partager la même adresse email
userSchema.plugin(uniqueValidator);

//On exporte le schéma sous forme de modèle
module.exports = mongoose.model('user', userSchema);
