//On importe le package http de node
const http = require('http');

//On importe l'application express
const app = require('./app');

//La fonction normalizePort renvoie un port valide, qu'il soit fourni sous forme de d'un numéro ou d'une chaîne
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  // Si port n'est pas un nombre
  if (isNaN(port)) {
    // retourne val
    return val;
  }
  // si port est un nombre >=0
  if (port >= 0) {
    // retourne port
    return port;
  }
  // sinon retourne Faux
  return false;
};

const port = normalizePort(process.env.PORT || '3000');
//On dit à l'application express sur quel port elle doit tourner
app.set('port', port);

// La fonction errorHandler recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur
const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pire' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + 'requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + 'is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//On passe l'application express au server
const server = http.createServer(app);
// si le server est en erreur, on appelle la fonction errorHandler qui gère les erreurs
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe' + address : 'port' + port;
  console.log('Listening on' + bind);
});
// On ecoute le server
server.listen(port);
