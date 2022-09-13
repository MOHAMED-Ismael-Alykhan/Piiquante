//On importe le package bcrypt
const bcrypt = require('bcrypt');
//On importe le package jsonwebtoken
const jwt = require('jsonwebtoken');
//On importe le package MaskData
const MaskData = require('maskdata');
//On appel le model user
const User = require('../models/user');

const maskedEmail = MaskData.maskEmail2;

// Création de la fonction signup pour l'enregistrement de nouveaux utilisateurs
exports.signup = (req, res, next) => {
  //On va hacher le mot de passe du corp de la requête qui sera passé par le frontend
  bcrypt
    .hash(req.body.password, 10)
    //On récupère le hash du mot de passe qu'on enregistre dans un nouveau user dans la base de données
    .then((hash) => {
      const user = new User({
        email: maskedEmail(req.body.email),
        password: hash,
      });

      //On enregistre dans la base de données
      user
        .save()
        .then(() => res.status(201).json({ message: 'utilisateur créé!' }))
        .catch((error) => res.status(400).json({ error }));
    })
    //Cas d'une erreur serveur
    .catch((error) => res.status(500).json({ error }));
};

// Création de la fonction login pour connecter des utilisateurs existants
exports.login = (req, res, next) => {
  //On vérifie si un utilisateur existe dans notre base de données
  User.findOne({ email: maskedEmail(req.body.email) })
    .then((user) => {
      //Si l'adresse mail n'existe pas dans la base de données
      if (user === null) {
        res
          .status(401)
          .json({ message: 'Paire identifiant/mot de passe incorrecte' });
      } else {
        //On compare le mot de passe qui nous a été transmis par le client avec le mot de passe de la base de données
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            // Si le mot de passe ne correspond pas
            if (!valid) {
              res
                .status(401)
                .json({ message: 'Paire identifiant/mot de passe incorrecte' });
              // Si c'est ok
            } else {
              res.status(200).json({
                //renvoi de l'user Id
                userId: user._id,
                //On appelle la fonction sign pour encoder les données que l'on veut (payload)
                //Renvoi du token qui contient l'Id de l'utilisateur en tant que payload (les données encodées dans le token)
                token: jwt.sign(
                  { userId: user._id },
                  // Clé secrète pour l'encodage (pour le développement temporaire), sert au chiffrement et déchiffrement du token
                  process.env.SECRET_TOKEN,
                  //On définit la durée de validité du token
                  { expiresIn: '24h' }
                ),
              });
            }
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      }
    })
    //En cas d'erreur d'éxécution de requête dans la base de données
    .catch((error) => {
      res.status(500).json({ error });
    });
};
