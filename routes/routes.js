import express from "express";
import controller from "../controller/controller.js";

const router = (model) => {
  const Router = express.Router();
  const Controller = controller(model);

  Router.route("/").get(Controller.get).post(Controller.post);

  Router.route("/:id")
    .get(Controller.getOne)
    .put(Controller.put)
    .delete(Controller.delete);

  return Router;
};

export default router;
