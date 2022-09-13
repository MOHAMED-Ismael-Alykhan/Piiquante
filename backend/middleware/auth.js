//On importe jsonwebtoken
const jwt = require('jsonwebtoken');

//On exporte le middleware
module.exports = (req, res, next) => {
  //On récupère le token
  try {
    /*Pour cela on récupère le header que l'on split pour diviser la chaîne de caractère en un tableau
     autour de l'espace entre le mot Bearer et le token*/
    // On récupère le token qui est en deuxème d'ou le [1]
    const token = req.headers.authorization.split(' ')[1];

    //On décode le token avec la méthode verify
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);

    //On récupère le userId du token
    const userId = decodedToken.userId;

    //On rajoute cette valeur à l'objet Request qui sera transmis aux routes qui seront appellées par la suite
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
