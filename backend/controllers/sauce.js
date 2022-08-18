const Sauce = require('../models/sauce');

exports.createSauce = (req, res, next) => {
  //on retire le champ id du corps de la requête qui a été généré par mongoDB
  delete req.body._id;
  //On crée une instance de notre modèle Sauce en lui passant un objet Javascript contenant les infos requises du corps de la requête.
  const sauce = new Sauce({
    ...req.body,
  });

  //On enregistre cette sauce dans la base de données
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée!' }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  //Pour modifier la sauce unique ayant le même _id que le paramètre de la requête
  Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'sauce modifiée!' }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  //Pour supprimer la sauce unique ayant le même _id que le paramètre de la requête
  Sauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'sauce supprimée!' }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  //Pour trouver la sauce unique ayant le même _id que le paramètre de la requête
  Sauce.findOne({ _id: req.params.id })
    .then((thing) => res.status(200).json(thing))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    //On renvoie le tableau contenant toutes les sauces dans la base de données
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};
