// On importe express
const express = require('express');
//Importation de mongoose
const mongoose = require('mongoose');
//On importe path qui nous donne accès au chemin des système fichiers
const path = require('path');
// const app qui est notre application
const app = express();
//importation de helmet pour sécuriser les en-têtes http
const helmet = require('helmet');
//importation de dotenv qui stocke nos variables d'environnement et permet d'eviter de rendre visible dans le code des données sensibles.
require('dotenv').config();

//On importe les routers
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

app.use(helmet());
//Connexion à la base de donnéés MongoDB
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_MDP}@cluster0.ua7jqpi.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('Connexion à MongoDB réussie!'))
  .catch(() => console.log('Connexion à MongoDB échouée!'));

/*Permet à express de prendre toutes les requêtes qui ont comme Content-Type application.json
 et met à disposition leur body directement sur l'objet req.*/
app.use(express.json());

/* Le CORS (Cross Origin Resource Sharing) définit comment les serveurs et les navigateurs interagissent,
 en spécifiant quelles ressources peuvent être demandées de manière légitime */

// Empêche les erreurs de CORS entre deux servers différents.
app.use((req, res, next) => {
  //Permet d'accéder à l'API depuis n'importe quelle origine ('*')
  res.setHeader('Access-Control-Allow-Origin', '*');
  //Permet d'ajouter les headers mentionnées aux requêtes envoyées vers l'API
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  //Permet d'envoyer des requêtes avec les méthodes mentionnnées
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  next();
});

// On enregistre le router pour toutes les demandes effectuées vers /api/sauces, on utilise le router de sauceRoutes
app.use('/api/sauces', sauceRoutes);

// route attendue par le frontend, on enregistre ce router dans notre application Express
app.use('/api/auth', userRoutes);

//On ajoute une route qui va servir des fichiers statiques
app.use('/images', express.static(path.join(__dirname, 'images')));

//On exporte pour pouvoir y accéder depuis les autres fichiers
module.exports = app;
