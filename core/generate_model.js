import inquirer from "inquirer";
import fs from "fs/promises";

const questions = [
  {
    type: "input",
    name: "modelName",
    message: "Quel est le nom du modèle Mongoose ?",
  },
  {
    type: "input",
    name: "fieldCount",
    message: "Combien de champs souhaitez-vous ajouter au modèle ?",
    validate: function (value) {
      const valid = !isNaN(parseFloat(value));
      return valid || "Veuillez entrer un nombre valide.";
    },
    filter: Number,
  },
];

async function runCLI() {
  const { modelName, fieldCount } = await inquirer.prompt(questions);

  const fields = [];

  for (let i = 0; i < fieldCount; i++) {
    const field = await inquirer.prompt([
      {
        type: "input",
        name: "fieldName",
        message: `Nom du champ ${i + 1} :`,
      },
      {
        type: "input",
        name: "fieldType",
        message: `Type du champ ${i + 1} :`,
        validate: function (value) {
          return value !== "" || "Veuillez entrer un type de champ valide.";
        },
        filter: function (value) {
          return value.charAt(0).toUpperCase() + value.slice(1);
        },
      },
      {
        type: "confirm",
        name: "isRequired",
        message: "Ce champ est-il requis ?",
        default: false,
      },
    ]);

    fields.push(field);
  }

  const modelContent = `
import mongoose from "mongoose";

const ${modelName}Schema = new mongoose.Schema({
  ${fields
    .map((field) => `${field.fieldName}: { type: ${field.fieldType}, required: ${field.isRequired} }`)
    .join(",\n  ")}
});

const ${modelName} = mongoose.model("${modelName}", ${modelName}Schema);

export default ${modelName};
`;

  await fs.writeFile(`models/${modelName}.js`, modelContent);

  console.log(`Le modèle ${modelName} a été généré avec succès.`);
  process.exit(0);
}

runCLI();
