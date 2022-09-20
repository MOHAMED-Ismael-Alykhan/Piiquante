# Construction d'une API sécurisée pour une application d'avis gastronomiques

## CONTEXTE

Les Sauces piquantes sont de plus en plus populaires. C'est pourquoi la marque de condiments à base de piment Piiquante,
veut développer une application web de critique des sauces piquantes appelée "hot takes".

La première version du site sera une " galerie de sauces".

## OBJECTIF

Construire une API en backend pour le site Hot Takes permettant aux utilisateurs de télécharger leurs sauces piquantes préférées et de
liker ou disliker les sauces que d'autres partagent. Le front-end de l'application a été développé à l'aide d'Angular et a été précompilé après des tests internes.

---

#### Contenus de ce repository

Le repository contient à la fois le dossier Frontend et le dossier Backend.

Ainsi vous avez la possibilité de cloner ce repository pour récupérer en local la partie Frontend et la partie Backend de l'application.

### Installation

- Cloner le repository depuis GitHub.

* Ce projet utilise .dotenv pour protéger les mots de passes et la clé du token figurant dans le code. Par conséquent il faudra penser à créer un fichier .env dans le backend afin d'y rentrer les différents mots de passes. Ces mots de passes seront transmis dans un document txt à part pour garantir la confidentialité du projet.

* Il est égalemnt nécessaire de créer un dossier "images" dans le backend.

#### Pour lancer le Frontend

- Aller sur le dossier Frontend et ouvrir un terminal.

* Exécuter `npm install` pour installer les dépendances.
* Taper `npm start` pour avoir accès au serveur.
* Rendez-vous sur http://localhost:4200/ via votre navigateur.

#### Pour lancer le Backend

- Ouvrir un nouveau terminal sur ce dossier.
- Exécuter `npm install`pour installer les dépendances.
- Lancer le server avec `nodemon server`.

### En cas de non création d'un compte sur le site Hot Takes il ne faut pas hésiter à relancer le frontend avec `npm start` et le backend avec `nodemon server`.

#### CONNEXION IMPORTANT

- Pour s'inscrire sur l'application, l'utilisateur doit rentrer un Email au format valide et un mot de passe de
  8 caractères au minimum, au moins une majuscule, une minuscule et deux chiffres au minimum et ne pas contenir d'espace.
