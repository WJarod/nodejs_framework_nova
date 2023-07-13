// Importation des modules nécessaires
import inquirer from "inquirer";
import fs from "fs/promises";
import fsSync from "fs";

// Fonction pour obtenir les modèles existants
async function getExistingModels() {
  const files = fsSync.readdirSync("./models");
  return files.map(file => file.replace(".js", ""));
}

// Fonction pour exécuter l'interface de ligne de commande
async function runCLI() {
  const existingModels = await getExistingModels();

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

  const { modelName, fieldCount } = await inquirer.prompt(questions);

  const fields = [];

  for (let i = 0; i < fieldCount; i++) {
    const validTypes = ["String", "Number", "Date", "Boolean", "[String]", "[Number]", "[Date]", "[Boolean]", "Schema.Types.ObjectId", "[Schema.Types.ObjectId]", ...existingModels];
    
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
          return validTypes.includes(value) || `Veuillez entrer un type de champ valide. Les types valides sont : ${validTypes.join(', ')}`;
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
    .map(field => {
      if (existingModels.includes(field.fieldType)) {
        return `${field.fieldName}: { type: mongoose.Schema.Types.ObjectId, ref: '${field.fieldType}', required: ${field.isRequired} }`;
      } else if (field.fieldType === "Schema.Types.ObjectId" || field.fieldType === "[Schema.Types.ObjectId]") {
        return `${field.fieldName}: { type: mongoose.${field.fieldType}, required: ${field.isRequired} }`;
      } else {
        return `${field.fieldName}: { type: ${field.fieldType}, required: ${field.isRequired} }`;
      }
    })
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
