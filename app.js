// Importation des modules nécessaires
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { logToFile } from "./log/logger.js";

// Importation du générateur de routes dynamiques
import generate_routes from "./core/generate_routes.js";

// Création de l'application Express
const app = express();
// Configuration dotenv pour gérer les variables d'environnement
dotenv.config();

// Ajout des middlewares pour la gestion du corps des requêtes HTTP et le CORS
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Ajout d'une route simple pour tester le fonctionnement de l'API
app.get("/", (req, res) => {
  res.send("Bonjour à l'API REST !");
});

// Fonction pour démarrer le serveur
async function startServer() {
  try {
    // Génération des routes en utilisant les modèles définis
    const routes = await generate_routes();
    // Ajout des routes générées à l'application Express
    routes.forEach(({ name, route }) => {
      app.use(`/${name}`, route);
    });

    // Connexion à la base de données MongoDB
    const PORT = process.env.PORT;
    const MONGO_URI = process.env.MONGO_URI;
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    // Démarrage du serveur
    app.listen(PORT, () => console.log(`Serveur en cours d'exécution sur le port : ${PORT}`));
  } catch (error) {
    console.error(error.message);
    // Écriture de l'erreur dans un fichier de logs
    logToFile(`Erreur : ${error.message}`, true);
    // En cas d'erreur, tentative de reconnexion toutes les 10 minutes
    setTimeout(startServer, 600000); 
  }
}

// Démarrage du serveur
startServer();
