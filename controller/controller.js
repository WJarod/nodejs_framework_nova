import { logToFile } from "../log/logger.js";

const controller = (model, model_name) => ({
  get: async (req, res) => {
    try {
      const data = await model.find({});
      logToFile(`get all data from ${model_name} collection`, false); // Succès (couleur verte)
      res.json(data);
    } catch (err) {
      logToFile(`Error in get: ${err.message}`, true); // Erreur (couleur rouge)
      res.status(500).json(err);
    }
  },
  getOne: async (req, res) => {
    try {
      const data = await model.findById(req.params.id);
      logToFile(`get one data from ${model_name} collection`, false); // Succès (couleur verte)
      res.json(data);
    } catch (err) {
      logToFile(`Error in getOne: ${err.message}`, true); // Erreur (couleur rouge)
      res.status(500).json(err);
    }
  },
  post: async (req, res) => {
    try {
      const newData = new model(req.body);
      await newData.save();
      logToFile(`post one data to ${model_name} collection`, false); // Succès (couleur verte)
      res.json(newData);
    } catch (err) {
      logToFile(`Error in post: ${err.message}`, true); // Erreur (couleur rouge)
      res.status(500).json(err);
    }
  },
  put: async (req, res) => {
    try {
      const data = await model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      logToFile(`put one data to ${model_name} collection`, false); // Succès (couleur verte)
      res.json(data);
    } catch (err) {
      logToFile(`Error in put: ${err.message}`, true); // Erreur (couleur rouge)
      res.status(500).json(err);
    }
  },
  delete: async (req, res) => {
    try {
      const data = await model.findByIdAndDelete(req.params.id);
      logToFile(`delete one data from ${model_name} collection`, false); // Succès (couleur verte)
      res.json(data);
    } catch (err) {
      logToFile(`Error in delete: ${err.message}`, true); // Erreur (couleur rouge)
      res.status(500).json(err);
    }
  },
});

export default controller;
