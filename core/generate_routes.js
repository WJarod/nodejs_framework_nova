import fs from "fs";
import generic_routes from "../routes/routes.js";

const generate_routes = async () => {
  const routes = [];
  const files = fs.readdirSync("./models");

  await Promise.all(
    files.map(async (file) => {
      const model_name = file.split(".")[0];
      const model_uri = (await import(`../models/${model_name}.js`)).default;
      const route = generic_routes(model_uri);
      routes.push({ name: model_name.toLowerCase(), route });
    })
  );

  return routes;
};

export default generate_routes;
