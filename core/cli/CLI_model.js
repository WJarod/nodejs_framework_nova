// Importation des modules nécessaires
import inquirer from "inquirer";
import fs from "fs/promises";
import fsSync from "fs";
import chalk from "chalk";
import boxen from "boxen";

// Fonction pour obtenir les modèles existants
async function getExistingModels() {
    const files = fsSync.readdirSync("./models");
    return files.map((file) => file.replace(".js", ""));
}

// Fonction pour exécuter l'interface de ligne de commande
async function runCLI() {
    try {
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
            const validTypes = [
                "String",
                "Number",
                "Date",
                "Boolean",
                "[String]",
                "[Number]",
                "[Date]",
                "[Boolean]",
                "Schema.Types.ObjectId",
                "[Schema.Types.ObjectId]",
                ...existingModels,
            ];

            const field = await inquirer.prompt([
                {
                    type: "input",
                    name: "fieldName",
                    message: `Nom du champ ${i + 1} :`,
                },
                {
                    type: "list",
                    name: "fieldType",
                    message: `Type du champ ${i + 1} :`,
                    choices: validTypes
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
                .map((field) => {
                    if (existingModels.includes(field.fieldType)) {
                        return `${field.fieldName}: { type: mongoose.Schema.Types.ObjectId, ref: '${field.fieldType}', required: ${field.isRequired} }`;
                    } else if (
                        field.fieldType === "Schema.Types.ObjectId" ||
                        field.fieldType === "[Schema.Types.ObjectId]"
                    ) {
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

        const modelConsoleView = `
${chalk.bold("Modèle généré avec succès !")}
${chalk.bold(`${modelName} {`)}
${fields
                .map((field) => {
                    return `${field.fieldName} (${field.fieldType})${field.isRequired ? " (requis)" : ""
                        }`;
                })
                .join("\n")}
${chalk.bold(`}`)}
`;
        console.log(
            boxen(modelConsoleView, {
                padding: 1,
                margin: 1,
                borderStyle: "round",
                borderColor: "green",
            })
        );
    } catch (err) {
        console.error(`Error generating model: ${err.message}`);
    } finally {
        process.exit(0);
    }
}

runCLI();
