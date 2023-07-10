import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { logToFile } from "./log/logger.js";

// Générateur de routes dynamiques
import generate_routes from "./core/generate_routes.js";

const app = express();
dotenv.config();

// Middlewares
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Bonjour à l'API REST !");
});

async function startServer() {
  try {
    // Générer les routes
    const routes = await generate_routes();
    routes.forEach(({ name, route }) => {
      app.use(`/${name}`, route);
    });

    // Connexion à la base de données
    const PORT = process.env.PORT;
    const MONGO_URI = process.env.MONGO_URI;
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => console.log(`Serveur en cours d'exécution sur le port : ${PORT}`));
  } catch (error) {
    console.error(error.message);
    logToFile(`Erreur : ${error.message}`, true);
    // Tentative de reconnexion toutes les 10 minutes
    setTimeout(startServer, 600000); 
  }
}

startServer();
