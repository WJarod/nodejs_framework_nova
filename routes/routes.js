import express from "express";
import controller from "../controller/controller.js";

const router = (model) => {
    const Router = express.Router();
    const Controller = controller(model);

    Router.get("/", Controller.get);
    Router.get("/:id", Controller.getOne);
    Router.post("/", Controller.post);
    Router.put("/:id", Controller.put);
    Router.delete("/:id", Controller.delete);

    return Router;
}

export default router;