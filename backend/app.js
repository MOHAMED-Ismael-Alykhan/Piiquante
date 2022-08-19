const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

//On importe les routers
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//Connexion à la base de donnéés MongoDB
mongoose
  .connect(
    'mongodb+srv://Utilisateur:mgrjl7FOJekAL2ft@cluster0.ua7jqpi.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('Connexion à MongoDB réussie!'))
  .catch(() => console.log('Connexion à MongoDB échouée!'));

const app = express();

//Permet à express de prendre toutes les requêtes qui ont comme Content-Type application.json et met à disposition leur body directement sur l'objet req.
app.use(express.json());

// Empêche les erreurs de CORS entre deux servers différents.
app.use((req, res, next) => {
  //Permet d'accéder à l'API depuis n'importe quelle origine ('*')
  res.setHeader('Access-Control-Allow-Origin', '*');
  //Permet d'ajouter les headers mentionnées aux requêtes envoyées vers l'API
  res.setHeader(
    'Access-Control-Allow-header',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  //Permet d'envoyer des requêtes avec les méthodes mentionnnées
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  //res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

// On enregistre le router pour toutes les demandes effectuées vers /api/sauce
app.use('/api/sauce', sauceRoutes);

// route attendue par le frontend, on enregistre ce router dans notre application Express
app.use('/api/auth', userRoutes);

//On ajoute une route qui va servir des fichiers statiques
app.use('/images', express.static(path.join(__dirname, 'images')));

/*app.use((req, res, next) => {
  console.log("Requête reçue!");
  next();
});

app.use((req, res, next) => {
  res.status(201);
  next();
});
//L'application utilisera cette fonction pour tout type de requëte
app.use((req, res, next) => {
  res.json({ message: " Votre requête a bien été reçue!" });
  next();
});

app.use((req, res, next) => {
  console.log("Réponse envoyée avec succès!");
});
*/
module.exports = app;
