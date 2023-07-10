const controller = (Model) => {
    return {
        get: async (req, res) => {
            console.log("get all data from  collection");
            try {
                const data = await Model.find({});
                res.json(data);
            } catch (err) {
                res.status(500).json(err);
            }
        },
        getOne: async (req, res) => {
            console.log("get one data from  collection");
            try {
                const data = await Model.findById(req.params.id);
                res.json(data);
            } catch (err) {
                res.status(500).json(err);
            }
        },
        post: async (req, res) => {
            console.log("post one data to  collection");
                const data = req.body;
                const newData = new Model(data);
            try {
                await newData.save();
                res.json(data);
            } catch (err) {
                res.status(500).json(err);
            }
        },
        put: async (req, res) => {
            console.log("put one data to  collection");
            try {
                const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
                    new: true
                });
                res.json(data);
            } catch (err) {
                res.status(500).json(err);
            }
        },
        delete: async (req, res) => {
            console.log("delete one data from  collection");
            try {
                const data = await Model.findByIdAndDelete(req.params.id);
                res.json(data);
            } catch (err) {
                res.status(500).json(err);
            }
        }
    };
}

export default controller;