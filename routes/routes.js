import express from "express";
import controller from "../controller/controller.js";

const router = (model, model_name) => {
  const Router = express.Router();
  const Controller = controller(model, model_name);

  Router.route("/").get(Controller.get).post(Controller.post);

  Router.route("/:id")
    .get(Controller.getOne)
    .put(Controller.put)
    .delete(Controller.delete);

  return Router;
};

export default router;
