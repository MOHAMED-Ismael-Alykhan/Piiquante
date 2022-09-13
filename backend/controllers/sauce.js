// On importe le modèle de la sauce
const Sauce = require('../models/sauce');
// On importe le filesystem (fs) qui permet de gérer les fichiers
const fs = require('fs');

/********************* CREATION D'UNE SAUCE *****************/

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
    //Avec ce qui nous a été passé moins les deux champs supprimés précédemment
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],

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

/*********************************** MODIFIER UNE SAUCE BASE **********************************/

exports.modifySauce = (req, res, next) => {
  // Suppression de l'ancienne image si une nouvelle est choisie
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        delete sauceObject._userId;
        if (sauce.userId === req.auth.userId) {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, (err) => {
            if (err) throw err;
          });
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }

  //On regarde si il y a un champ file dans notre objet
  const sauceObject = req.file
    ? {
        //Si c'est le cas on récupère l'objet en parsant la chaîne de caractère et en recréant Url de l'image
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      } // Si il n'y a pas de file transmis, on récupère l'objet directement dans le corps de la requête
    : { ...req.body };
  //On supprime le userId venant de la requête pour éviter les fraudes
  delete sauceObject._userId;
  //On récupère l'objet en base de données
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //On vérifie que l'objet appartient bien à l'utilisateur qui nous envoie la requête de modification
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non-autorisé' });
      } else {
        //On met à jour notre enregistrement
        Sauce.updateOne(
          //On passe notre filtre qui dit quel enregistrement mettre à jour et avec quel objet
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )

          .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))

          .catch((error) => res.status(401).json({ error }));
      }
    })

    .catch((error) => {
      res.status(400).json({ error });
    });
};

/**************************** EFFACER UNE SAUCE ****************************/

exports.deleteSauce = (req, res, next) => {
  //On récupère l'objet en base
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //On vérifie que c'est le créateur de la sauce qui en demande la suppression
      // On vérifie que le userId récupéré en base correspond bien au userId que nous récupérons du token
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non-autorisé' });
      } else {
        //On récupère le nom du fichier
        const filename = sauce.imageUrl.split('/images/')[1];

        //On utilise la méthode unlink de fs pour la suppression du fichier dans le système de fichiers
        fs.unlink(`images/${filename}`, () => {
          //On supprime l'enregistrement dans la base de données
          //Pour supprimer la sauce unique ayant le même _id que le paramètre de la requête
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: 'Sauce supprimé!' });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

/********************* ACCEDER A UNE SAUCE ********************************/

exports.getOneSauce = (req, res, next) => {
  //Pour trouver la sauce unique ayant le même _id que le paramètre de la requête
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    // SI erreur envoit un statut 404 Not found
    .catch((error) => res.status(404).json({ error }));
};

/********************* ACCEDER A TOUTES LES SAUCES ************************/

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    //On renvoie le tableau contenant toutes les sauces dans la base de données
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};
