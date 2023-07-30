// Importation des modules nécessaires
import inquirer from "inquirer";
import fs from "fs/promises";
import chalk from "chalk";
import simpleGit from "simple-git";

// Fonction pour exécuter l'interface de ligne de commande
async function runCLI() {
    try {
        const questions = [
            {
                type: "input",
                name: "message",
                message: "Quel est le message du commit ?",
                validate: function (value) {
                    const valid = value.length > 0;
                    return valid || "Veuillez entrer un message valide.";
                },
            },
            {
                type: "confirm",
                name: "push",
                message: "Voulez-vous pusher les modifications ?",
                default: false,
            },
        ];

        const { message, push } = await inquirer.prompt(questions);

        // Supprimer les fichiers dans le dossier models sauf User.js
        const files = await fs.readdir("./models");
        for (const file of files) {
            if (file !== "User.js") {
                // Supprimer le fichier
                await fs.unlink(`./models/${file}`);
            }
        }

        // Exécuter la commande git add && git commit
        const git = simpleGit();
        await git.add(".");
        await git.commit(message);

        console.log(chalk.green(`La commande git add && git commit s'est terminée avec succès.`));

        // Vérifier si on veut effectuer un git push
        if (push) {
            await git.push("origin", "main");
            console.log(chalk.green("Git push effectué avec succès."));
        }

        process.exit(0);
    } catch (error) {
        console.error(chalk.red(`Erreur lors de l'exécution de la commande : ${error}`));
        process.exit(1);
    }
}

runCLI();
