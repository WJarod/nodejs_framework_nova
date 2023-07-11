// Importation des modules nécessaires
import express from "express";
import controller from "../controller/controller.js";

// Fonction pour générer les routes en fonction d'un modèle et d'un nom de modèle
const router = (model, model_name) => {
  // Création d'un nouveau routeur Express
  const Router = express.Router();
  // Génération d'un contrôleur pour le modèle
  const Controller = controller(model, model_name);

  // Définition des routes pour le modèle
  // Route pour obtenir tous les éléments et pour ajouter un nouvel élément
  Router.route("/").get(Controller.get).post(Controller.post);

  // Route pour obtenir, mettre à jour et supprimer un élément spécifique
  Router.route("/:id")
    .get(Controller.getOne)
    .put(Controller.put)
    .delete(Controller.delete);

  // Retour du routeur
  return Router;
};

// Exportation de la fonction router
export default router;
