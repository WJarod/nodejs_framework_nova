// Importation des modules nécessaires
import fs from "fs";
import generic_routes from "../routes/routes.js";

// Fonction pour générer les routes en fonction des modèles définis
const generate_routes = async () => {
  // Création d'un tableau pour stocker les routes
  const routes = [];
  // Lecture du répertoire des modèles
  const files = fs.readdirSync("./models");

  // Boucle sur chaque fichier de modèle
  await Promise.all(
    files.map(async (file) => {
      // Extraction du nom du modèle à partir du nom du fichier
      const model_name = file.split(".")[0];
      // Importation du modèle
      const model_uri = (await import(`../models/${model_name}.js`)).default;
      // Génération des routes pour le modèle
      const route = generic_routes(model_uri, model_name);
      // Ajout de la route au tableau des routes
      routes.push({ name: model_name.toLowerCase(), route });
    })
  );

  // Retour des routes
  return routes;
};

// Exportation de la fonction generate_routes
export default generate_routes;
