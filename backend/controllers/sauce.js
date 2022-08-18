const Sauce = require('../models/sauce');

exports.createSauce = (req, res, next) => {
  //On parse l'objet requête car envoyé sous chaîne de caractères
  const sauceObject = JSON.parse(req.body.sauce);

  //On supprime dans cet objet deux champs: le champs _id parce que l'id de l'objet va être généré automatiquement par notre base de données
  //Et le champ userId qui correspond à la personne qui a créé l'objet car on ne fait pas confiance au client
  // On utilise le userId qui vient du token d'authentification car on est sûre qu'il est valide (empêche les fraudes)
  delete sauceObject._id;
  delete sauceObject._userId;

  //On crée notre objet
  const sauce = new Sauce({
    //Avec ce qui nous a été passé moins les deux champs supprimés
    ...sauceObject,
    //On extrait le userId de l'objet requête grâce au middleware
    userId: req.auth.userId,
    //On génère Url de l'image par nous même car multer ne nous passe que le nom du fichier
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  });

  //On enregistre cette sauce dans la base de données
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée!' }))
    .catch((error) => res.status(400).json({ error }));
};

/*
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
*/

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