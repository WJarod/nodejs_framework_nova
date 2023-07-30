// Importation des modules nécessaires
import inquirer from "inquirer";
import fs, { promises as fsPromises } from "fs";
import chalk from "chalk";
import boxen from "boxen";
import path from "path";
import { fileURLToPath } from 'url';

// Fonction pour obtenir les modèles existants
async function getExistingModels() {
    try {
        const files = await fsPromises.readdir("./models");
        return files.map((file) => file.replace(".js", ""));
    } catch (err) {
        console.error(chalk.red("Erreur lors de la lecture du répertoire 'models'. Veuillez vous assurer que le répertoire existe et que vous disposez des autorisations appropriées."));
        process.exit(1);
    }
}

// Validation du nom du modèle
function validateModelName(modelName) {
    const validModelName = /^[a-zA-Z0-9_]+$/;
    if (!validModelName.test(modelName)) {
        return "Veuillez entrer un nom de modèle valide (caractères alphanumériques et underscores uniquement).";
    }
    return true;
}

// Fonction pour vérifier si un modèle existe déjà
async function isModelExists(modelName) {
    const existingModels = await getExistingModels();
    return existingModels.includes(modelName);
}

// Fonction pour exécuter l'interface de ligne de commande
async function runCLI() {
    try {
        const existingModels = await getExistingModels();

        const questions = [
            {
                type: "list",
                name: "modelName",
                message: "Pour quel modèle voulez-vous générer des tests ?",
                choices: existingModels,
            },
        ];

        const { modelName } = await inquirer.prompt(questions);

        const testContent = `
import { describe, it } from "mocha";
import { expect } from "chai";
import ${modelName} from "../models/${modelName}";

describe("${modelName}", () => {
  it("should pass this placeholder test", () => {
    expect(true).to.be.true;
  });
});
`;

        // Vérifiez si le dossier de test existe, sinon créez-le
        const testDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../test");
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir);
        }

        await fsPromises.writeFile(`test/${modelName}.test.js`, testContent);

        console.log(
            boxen(`Test généré avec succès pour le modèle ${modelName} !`, {
                padding: 1,
                margin: 1,
                borderStyle: "round",
                borderColor: "green",
            })
        );
    } catch (err) {
        console.error(chalk.red(`Erreur lors de la génération du test : ${err.message}`));
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

runCLI();
