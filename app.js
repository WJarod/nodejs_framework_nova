import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import gen_routes from "./core/app/APP_gen_routes.js";
import errorHandler from "./core/app/handler/errorHandler.js";
import log from "./core/app/log/logger.js";
import bd_connect from "./core/app/APP_bd_connect.js";

const app = express();
dotenv.config();

// Middleware pour la gestion du corps des requêtes HTTP et le CORS
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
// Middleware pour la gestion des erreurs
app.use(errorHandler);

// Route de test
app.get("/", (req, res) => {
  res.send("Bonjour à l'API REST !");
});

async function startServer() {
  try {
    // Génération des routes en utilisant les modèles définis
    try {
      const routes = await gen_routes();
      routes.forEach((route) => {
        app.use(`/${route.name}`, route.route);
      });
    } catch (err) {
      log.error(`Error generating routes: ${err.message}`);
    }
    // Connexion à la base de données MongoDB
    bd_connect();
    // Démarrage du serveur
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      log.info(`Serveur en cours d'exécution sur le port : ${PORT}`);
    });
  } catch (error) {
    log.error(error);
  }
}

startServer();

export default app;