const controller = (Model) => ({
  get: async (req, res) => {
    try {
      const data = await Model.find({});
      res.json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getOne: async (req, res) => {
    try {
      const data = await Model.findById(req.params.id);
      res.json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  post: async (req, res) => {
    try {
      const newData = new Model(req.body);
      await newData.save();
      res.json(newData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  put: async (req, res) => {
    try {
      const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  delete: async (req, res) => {
    try {
      const data = await Model.findByIdAndDelete(req.params.id);
      res.json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  },
});

export default controller;
