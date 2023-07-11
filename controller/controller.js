// Importation du logger
import { logToFile } from "../log/logger.js";

// Fonction pour générer un contrôleur pour un modèle spécifique
const controller = (model, model_name) => ({
  // Méthode pour obtenir tous les éléments
  get: async (req, res) => {
    try {
      const data = await model.find({});
      logToFile(`get all data from ${model_name} collection`, false); // Log de succès
      res.json(data);
    } catch (err) {
      logToFile(`Error in get: ${err.message}`, true); // Log d'erreur
      res.status(500).json(err);
    }
  },
  
  // Méthode pour obtenir un élément spécifique
  getOne: async (req, res) => {
    try {
      const data = await model.findById(req.params.id);
      logToFile(`get one data from ${model_name} collection`, false); // Log de succès
      res.json(data);
    } catch (err) {
      logToFile(`Error in getOne: ${err.message}`, true); // Log d'erreur
      res.status(500).json(err);
    }
  },
  
  // Méthode pour créer un nouvel élément
  post: async (req, res) => {
    try {
      const newData = new model(req.body);
      await newData.save();
      logToFile(`post one data to ${model_name} collection`, false); // Log de succès
      res.json(newData);
    } catch (err) {
      logToFile(`Error in post: ${err.message}`, true); // Log d'erreur
      res.status(500).json(err);
    }
  },
  
  // Méthode pour mettre à jour un élément spécifique
  put: async (req, res) => {
    try {
      const data = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      logToFile(`put one data to ${model_name} collection`, false); // Log de succès
      res.json(data);
    } catch (err) {
      logToFile(`Error in put: ${err.message}`, true); // Log d'erreur
      res.status(500).json(err);
    }
  },
  
  // Méthode pour supprimer un élément spécifique
  delete: async (req, res) => {
    try {
      const data = await model.findByIdAndDelete(req.params.id);
      logToFile(`delete one data from ${model_name} collection`, false); // Log de succès
      res.json(data);
    } catch (err) {
      logToFile(`Error in delete: ${err.message}`, true); // Log d'erreur
      res.status(500).json(err);
    }
  },
});

// Exportation de la fonction controller
export default controller;
