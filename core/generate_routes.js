import fs from "fs";
import generic_routes from "../routes/routes.js";

const generate_routes = async () => {
  const routes = [];
  // Lire les fichiers du répertoire "models"
  const files = fs.readdirSync("./models");

  await Promise.all(
    files.map(async (file) => {
      try {
        // Extraire le nom du modèle à partir du nom du fichier
        const model_name = file.split(".")[0];
        // Importer le modèle
        const model_uri = (await import(`../models/${model_name}.js`)).default;
        // Générer les routes pour le modèle
        const route = generic_routes(model_uri, model_name); 
        // Ajouter les routes à la liste
        routes.push({ name: model_name.toLowerCase(), route });
      } catch (err) {
        console.error(`Error generating routes for model ${file}: ${err.message}`);
      }
    })
  );

  // Retourner la liste des routes générées pour chaque modèle
  return routes; 
};

export default generate_routes;
