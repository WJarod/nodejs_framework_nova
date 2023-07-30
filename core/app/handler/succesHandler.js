import log from '../log/logger.js';

// Middleware pour la gestion des succès
const succesHandler = (req, res, next) => {
    // Enregistrement du succès dans le fichier de log
    log.info(req);

    // Définition du statut de la réponse
    res.status(200);

    // Envoi de la réponse JSON contenant le message de succès
    res.json({
        success: {
            message: "Requête traitée avec succès"
        }
    });
}

// Exportation du middleware
export default succesHandler;