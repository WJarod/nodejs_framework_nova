import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { logToFile } from "./log/logger.js";
import generate_routes from "./core/generate_routes.js";
import errorHandler from "./handler/errorHandler.js";

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
    const routes = await generate_routes();
    routes.forEach(({ name, route }) => {
      app.use(`/${name}`, route);
    });

    // Connexion à la base de données MongoDB
    const PORT = process.env.PORT || 5000;
    const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017";
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    // Démarrage du serveur
    app.listen(PORT, () => console.log(`Serveur en cours d'exécution sur le port : ${PORT}`));
  } catch (error) {
    console.error(error.message);
    // Écriture de l'erreur dans un fichier de logs
    logToFile(`Erreur : ${error.message}`, true);
  }
}

startServer();
