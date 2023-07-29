// Importation des modules nécessaires
import inquirer from "inquirer";
import fs from "fs/promises";

// Fonction pour exécuter l'interface de ligne de commande
async function runCLI() {
    try {
        const questions = [
            {
                type: "input",
                name: "port",
                message: "Quel est le port du projet ?",
                validate: function (value) {
                    const valid = !isNaN(parseFloat(value));
                    return valid || "Veuillez entrer un nombre valide.";
                },
            },
            {
                type: "input",
                name: "databaseUrl",
                message: "Quel est l'url de la base de données ?",
            },
        ];

        const { port, databaseUrl } = await inquirer.prompt(questions);

        const env = `PORT=${port}\nDATABASE_URL=${databaseUrl}`;

        await fs.writeFile(".env", env);

        console.log("Fichier .env créé avec succès !");
    } catch (error) {
        console.error(`Error while creating .env file : ${error}`);
    } finally {
        process.exit(0);
    }
}

runCLI();