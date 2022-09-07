//const { json } = require('express');
const Sauce = require('../models/sauce');
const fs = require('fs');

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

/************************************ METHODE 1A **************************************************** */

/* PUT: To modify the sauce, checks if we modify a file or just the metadata
and deletes the last image, if the image was modified*/

/* Pour modifier la sauce, on regarde d'abord si on modifie le fichier (image de la sauce) ou juste les informations de 
la sauce. On supprime la dernière image si l'image a été modifiée*/
/*
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //checks the id of the sauce to modify, so later we can retrive the url of the image of the sauce before the file changed
      //vérifie l'id de la sauce à modifier, ainsi plus tard on pourra récupérer l'url de l'image de la sauce avant que le fichier ne change
      let updatedSauce = new Sauce({ _id: req.params.id });
      //We need to pass the id to the new sauce
      // Nous devons passer l'identifiant à la nouvelle sauce
      if (req.file) {
        //to see if the modif comes with a new file
        // pour voir si la modif est livrée avec un nouveau fichier
        const url = req.protocol + '://' + req.get('host');
        req.body.sauce = JSON.parse(req.body.sauce);
        //Our new sauce updated
        //Notre nouvelle sauce mise à jour
        updatedSauce = {
          name: req.body.sauce.name,
          manufacturer: req.body.sauce.manufacturer,
          description: req.body.sauce.description,
          mainPepper: req.body.sauce.mainPepper,
          imageUrl: `${url}/images/${req.file.filename}`,
          heat: req.body.sauce.heat,
        };
      } else {
        updatedSauce = {
          name: req.body.name,
          manufacturer: req.body.manufacturer,
          description: req.body.description,
          mainPepper: req.body.mainPepper,
          heat: req.body.heat,
        };
      }
      Sauce.updateOne({ _id: req.params.id }, updatedSauce)
        .then(() => {
          //Sauce is successfully updated
          //La sauce est mise à jour avec succès
          if (req.file) {
            // To delete the previous image, after modification has been successfully done
            // Pour supprimer l'image précédente, une fois la modification effectuée avec succès
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, (error) => {
              if (error) console.log(error);
            });
          }
          res.status(201).json({
            message: 'Sauce updated successufully',
          });
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};
/*
/************************************** METHODE BASE ************************************************** */
/*
exports.modifySauce = (req, res, next) => {
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
/*

/****************************** METHODE 2 **************************** */
//----------------------------------------------------------------------------------
// LOGIQUE MODIFYSAUCE
//----------------------------------------------------------------------------------
// modifie une sauce
exports.modifySauce = (req, res, next) => {
  // l'id de la sauce est l'id inscrit dans l'url
  Sauce.findOne({ _id: req.params.id })
    // si la sauce existe
    .then((sauce) => {
      // cette variable permettra de traverser le scope pour réduire le code
      var sauceBot;
      //constante de valeur heat de la sauce avant modification, servira si le nouveau heat a une valeur inacceptable (via postman)
      const heatAvant = sauce.heat;
      //l'user sera celui validé par le token, on ne pourra pas modifier l'appartenance de la sauce
      //like et tableau ne pourront pas être modifiés dans postman
      const immuable = {
        userId: req.auth.userId,
        likes: sauce.likes,
        dislikes: sauce.dislikes,
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked,
      };
      // l'id du créateur de la sauce doit etre le meme que celui identifié par le token
      if (sauce.userId !== req.auth.userId) {
        // reponse en status 403 Forbidden avec message json
        return res.status(403).json('unauthorized request');
        // si il y a un fichier avec la demande de modification
      } else if (req.file) {
        // on vérifie que c'est bien une image https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
        if (
          req.file.mimetype === 'image/jpeg' ||
          req.file.mimetype === 'image/png' ||
          req.file.mimetype === 'image/jpg' ||
          req.file.mimetype === 'image/bmp' ||
          req.file.mimetype === 'image/gif' ||
          req.file.mimetype === 'image/ico' ||
          req.file.mimetype === 'image/svg' ||
          req.file.mimetype === 'image/tiff' ||
          req.file.mimetype === 'image/tif' ||
          req.file.mimetype === 'image/webp'
        ) {
          // on détermine le nom de l'ancien fichier image
          const filename = sauce.imageUrl.split('/images/')[1];
          // si ceci correspond à une partie du nom de l'image par defaut
          const testImage = 'defaut/imagedefaut.png';
          // si le nom de l'image ne correspont pas à l'image defaut
          if (testImage != filename) {
            // on efface le fichier image qui doit se faire remplacer
            fs.unlink(`images/${filename}`, () => {});
          }
          // on extrait le sauce de la requete via le parse
          // dans req.body.sauce le sauce correspont à la key de postman pour ajouter les infos en texte
          const sauceObject = {
            ...JSON.parse(req.body.sauce),
            // on ajoute l'image avec ce nom
            imageUrl: `${req.protocol}://${req.get('host')}/images/${
              req.file.filename
            }`,
            ...immuable,
          };
          sauceBot = sauceObject;
          // si le fichier n'est pas une image
        } else {
          // on détermine le nom de l'ancien fichier image
          const filename = sauce.imageUrl.split('/images/')[1];
          // si ceci correspond à une partie du nom de l'image par defaut
          const testImage = 'defaut/imagedefaut.png';
          // si le nom de l'image ne correspont pas à l'image defaut
          if (testImage != filename) {
            // on efface le fichier image qui doit se faire remplacer
            fs.unlink(`images/${filename}`, () => {});
          }
          // on récupère avec le parse req.body.sauce et on y ajoute la nouvelle image
          // dans req.body.sauce le sauce correspont à la key de postman pour ajouter les infos en texte
          const sauceObject = {
            ...JSON.parse(req.body.sauce),
            // l'image sera l'image par defaut
            imageUrl: `${req.protocol}://${req.get(
              'host'
            )}/images/defaut/imagedefaut.png`,
            ...immuable,
          };
          sauceBot = sauceObject;
        }
        // si il n'y a pas de fichier avec la modification (ps: il garde son image injectée à la création)
      } else {
        // puisqu'il n'y a pas de fichier image, l'imageUrl de la requete sera par defaut l'ancienne imageUrl même si on modifie l'entrée avec postman
        req.body.imageUrl = sauce.imageUrl;
        // la sauce sera la requete
        const sauceObject = {
          ...req.body,
          ...immuable,
        };
        sauceBot = sauceObject;
      }
      // si problème avec valeur heat (postman) sa valeur restera celle avant la requête
      if (sauceBot.heat < 0 || sauceBot.heat > 10) {
        sauceBot.heat = heatAvant;
        console.log('valeur heat invalide, ancienne valeur heat conservée');
      }
      // modifie un sauce dans la base de donnée, 1er argument c'est l'objet qu'on modifie avec id correspondant à l'id de la requete
      // et le deuxième argument c'est la nouvelle version de l'objet qui contient le sauce qui est dans le corp de la requete et que _id correspond à celui des paramètres
      Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceBot, _id: req.params.id }
      )
        // retourne une promesse avec status 201 Created et message en json
        .then(() =>
          res
            .status(201)
            .json({ message: 'modified sauce (FR)Objet modifié !' })
        )
        // en cas d'erreur un status 400 Bad Request et l'erreur en json
        .catch((error) => res.status(400).json({ error }));
    })
    // en cas d'erreur
    .catch((error) => {
      // si il y a un fichier avec la requete
      if (req.file) {
        // le fichier de la requete a été créé avec multer donc on l'éfface
        fs.unlink(`images/${req.file.filename}`, () => {});
      }
      // erreur 404 Not Found indique l'erreur en json
      res.status(404).json({ error });
    });
};

/********************************************************************** */
/*
  //Pour modifier la sauce unique ayant le même _id que le paramètre de la requête
  Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'sauce modifiée!' }))
    .catch((error) => res.status(400).json({ error }));
};
*/

/************************************************************************** */

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

/*
  //Pour supprimer la sauce unique ayant le même _id que le paramètre de la requête
  Sauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'sauce supprimée!' }))
    .catch((error) => res.status(400).json({ error }));
};
*/
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

/************************************* Like, Dislike METHODE 1 ***********************************/

/*POST: To deal with the likes or dislikes of the created sauces
if like is = 1 the sauce is liked, if is = -1 is disliked. The count of the users likes are in an array */

/*POST : pour traiter les goûts ou les dégoûts des sauces créées
si like is = 1 la sauce est aimée, if is = -1 est détestée. Le nombre de likes des utilisateurs est dans un tableau */
/*
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    // to see if our user is in the array
    // pour voir si notre utilisateur est dans le tableau
    const userLikedIndex = sauce.usersLiked.indexOf(req.body.userId);
    //if our user liked the sauce, it will be find in the array, therefore is !== -1
    //si notre utilisateur a aimé la sauce, elle sera trouvée dans le tableau, donc vaut !== -1
    const userLiked = userLikedIndex !== -1;
    const userDislikedIndex = sauce.usersDisliked.indexOf(req.body.userId);
    const userDisliked = userDislikedIndex !== -1;

    if (req.body.like === 1 && !userLiked) {
      //if the user has not liked the sauce yet and is going to
      //si l'utilisateur n'a pas encore aimé la sauce et va
      sauce.likes++;
      sauce.usersLiked.push(req.body.userId);
      if (userDisliked) {
        //if the user had a dislike on the sauce
        //si l'utilisateur n'aime pas la sauce
        sauce.dislikes--;
        sauce.usersDisliked.splice(userDislikedIndex, 1);
      }
    } else if (req.body.like === -1 && !userDisliked) {
      //if the user has not dislike the sauce yet and is going to
      //si l'utilisateur n'a pas encore détesté la sauce et va
      sauce.dislikes++;
      sauce.usersDisliked.push(req.body.userId);
      if (userLiked) {
        //if the user had a liked on the sauce
        //si l'utilisateur avait un like sur la sauce
        sauce.likes--;
        sauce.usersLiked.splice(userLikedIndex, 1);
      }
    } else if (req.body.like === 0) {
      //cancel our like or dislike
      // annuler notre j'aime ou je n'aime pas
      if (userDisliked) {
        //if the user had a dislike on the sauce
        //si l'utilisateur n'aime pas la sauce
        sauce.dislikes--;
        sauce.usersDisliked.splice(userDislikedIndex, 1);
      } else if (userLiked) {
        //if the user had a liked on the sauce
        //si l'utilisateur avait un like sur la sauce
        sauce.likes--;
        sauce.usersLiked.splice(userLikedIndex, 1);
      }
    }
    Sauce.updateOne({ _id: req.params.id }, sauce)
      .then(() => {
        res.status(201).json({
          message: `Mention j'aime modifiée`,
        });
      })
      .catch((error) => {
        res.status(400).json({
          error: error,
        });
      });
  });
};
*/
/**************************** Like, Dislike METHODE 2 ************************** */

//----------------------------------------------------------------------------------
// LOGIQUE LIKESAUCE
//----------------------------------------------------------------------------------
// like une sauce
exports.likeSauce = (req, res, next) => {
  // on utilise le modele mangoose et findOne pour trouver un objet via la comparaison req.params.id
  Sauce.findOne({ _id: req.params.id })
    //retourne une promesse avec reponse status 200 OK et l'élément en json
    .then((sauce) => {
      // définition de diverse variables
      let valeurVote;
      let votant = req.body.userId;
      let like = sauce.usersLiked;
      let unlike = sauce.usersDisliked;
      // determine si l'utilisateur est dans un tableau
      let bon = like.includes(votant);
      let mauvais = unlike.includes(votant);
      // ce comparateur va attribuer une valeur de point en fonction du tableau dans lequel il est
      if (bon === true) {
        valeurVote = 1;
      } else if (mauvais === true) {
        valeurVote = -1;
      } else {
        valeurVote = 0;
      }
      // ce comparateur va determiner le vote de l'utilisateur par rapport à une action de vote
      // si l'user n'a pas voté avant et vote positivement
      if (valeurVote === 0 && req.body.like === 1) {
        // ajoute 1 vote positif à likes
        sauce.likes += 1;
        // le tableau usersLiked contiendra l'id de l'user
        sauce.usersLiked.push(votant);
        // si l'user a voté positivement et veut annuler son vote
      } else if (valeurVote === 1 && req.body.like === 0) {
        // enlève 1 vote positif
        sauce.likes -= 1;
        // filtre/enlève l'id du votant du tableau usersLiked
        const nouveauUsersLiked = like.filter((f) => f != votant);
        // on actualise le tableau
        sauce.usersLiked = nouveauUsersLiked;
        // si l'user a voté négativement et veut annuler son vote
      } else if (valeurVote === -1 && req.body.like === 0) {
        // enlève un vote négatif
        sauce.dislikes -= 1;
        // filtre/enlève l'id du votant du tableau usersDisliked
        const nouveauUsersDisliked = unlike.filter((f) => f != votant);
        // on actualise le tableau
        sauce.usersDisliked = nouveauUsersDisliked;
        // si l'user n'a pas voté avant et vote négativement
      } else if (valeurVote === 0 && req.body.like === -1) {
        // ajoute 1 vote positif à unlikes
        sauce.dislikes += 1;
        // le tableau usersDisliked contiendra l'id de l'user
        sauce.usersDisliked.push(votant);
        // pour tout autre vote, il ne vient pas de l'index/front donc probabilité de tentative de vote illégal
      } else {
        console.log('tentavive de vote illégal');
      }
      // met à jour la sauce
      Sauce.updateOne(
        { _id: req.params.id },
        {
          likes: sauce.likes,
          dislikes: sauce.dislikes,
          usersLiked: sauce.usersLiked,
          usersDisliked: sauce.usersDisliked,
        }
      )
        // retourne une promesse avec status 201 Created et message en json
        .then(() => res.status(201).json({ message: 'Vous venez de voter' }))
        // en cas d'erreur un status 400 et l'erreur en json
        .catch((error) => {
          if (error) {
            console.log(error);
          }
        });
    })
    // si erreur envoit un status 404 Not Found et l'erreur en json
    .catch((error) => res.status(404).json({ error }));
};
