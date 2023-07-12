import express from "express";
import controller from "../controller/controller.js";

const router = (model, model_name) => {
  const Router = express.Router();
  const Controller = controller(model, model_name);

  // Routes génériques pour CRUD
  Router.route("/").get(Controller.get).post(Controller.post);
  Router.route("/:id").get(Controller.getOne).put(Controller.put).delete(Controller.delete);

  // Routes personnalisées pour la logique métier
  if (model.businessLogic) {
    for (const [key, value] of Object.entries(model.businessLogic)) {
      Router.route(value.route)[value.method](value.handler);
    }
  }

  return Router;
};

export default router;
