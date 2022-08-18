const mongoose = require('mangoose');

// Création d'un schéma de données qui contient les champs souhaités pour chaque sauce. ATTENTION champs temporaires
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: Number, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  usersLiked: { type: Array, required: true },
  usersDisliked: { type: Array, required: true },
});

//On exporte le model, le rendant disponible pour l'application express.
module.exports = mongoose.model('sauce', sauceSchema);
