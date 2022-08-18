//On importe le package multer
const multer = require('multer');

//Préparation d'un dictionnaire MIME_TYPES
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

//On crée un objet de configuration pour multer. La méthode diskStorage configure le chemin et le nom de fichier pour les fichiers entrants
const storage = multer.diskStorage({
  //On explique à multer dans quel dossier enregistrer les fichiers
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  //On explique à multer quel nom de fichier utiliser
  filename: (req, file, callback) => {
    //On génère le nouveau nom pour le fichier
    //On utilise le nom d'origine du fichier, on remplace les espaces par '_'
    const name = file.originalname.split(' ').join('_');
    //On crée l'extension du fichier qui sera l'élément de notre dictionnaire qui correspond au mime_type envoyé par le frontend
    const extension = MIME_TYPES[file.mimetype];
    //On appelle le callback et en plus du nom, on utilise un timestamp + l'extension
    callback(null, name + Date.now() + '.' + extension);
  },
});

//On exporte le middleware multer configuré, on lui passe la constante storage et lui indique de gérer uniquement les téléchargements de fichiers images
module.exports = multer({ storage }).single('image');
