import { logToFile } from '../log/logger.js';

// Middleware pour la gestion des erreurs
const errorHandler = (err, req, res, next) => {
    // Enregistrement de l'erreur dans le fichier de log
    logToFile(`Error: ${err.message}`, true);
    
    // Définition du statut de la réponse en fonction de l'erreur
    res.status(err.status || 500);
    
    // Envoi de la réponse JSON contenant le message d'erreur
    res.json({
      error: {
        message: err.message
      }
    });
  };
  
  // Exportation du middleware
  export default errorHandler;
