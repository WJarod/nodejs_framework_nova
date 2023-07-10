import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";

// Routes import
import generic_routes from "./routes/routes.js";

const app = express();
dotenv.config();

// Middlewares
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());


// Routes
app.get("/", (req, res) => {
  res.send("Hello to FrameWorks Nova API");
}
);

fs.readdirSync("./models").forEach( async (file) => {
  const model = file.split(".")[0];
  const Model = await import(`./models/${model}.js`).then((module) => module.default);
  const routes = generic_routes(Model);
  app.use(`/${model}`, routes);
});

// Connect to DB
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
  .catch((error) => console.log(error.message));