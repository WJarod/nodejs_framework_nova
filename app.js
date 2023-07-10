import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Dynamic routes generator
import generate_routes from "./core/generate_routes.js";

const app = express();
dotenv.config();

// Middlewares
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Hello to REST API!");
});

async function startServer() {
  try {
    // Generate routes
    const routes = await generate_routes();
    routes.forEach(({ name, route }) => {
      app.use(`/${name}`, route);
    });

    // Connect to DB
    const PORT = process.env.PORT;
    const MONGO_URI = process.env.MONGO_URI;
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

startServer();
