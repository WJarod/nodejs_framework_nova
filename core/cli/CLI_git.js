// Importation des modules nécessaires
import inquirer from "inquirer";
import fs from "fs/promises";
import dotenv from "dotenv";
import chalk from "chalk";
import boxen from "boxen";
import { spawn } from "child_process";
// Fonction pour exécuter l'interface de ligne de commande
async function runCLI() {
    // git add . && git commit -m "custom message"
    try {
        const questions = [
            {
                type: "input",
                name: "message",
                message: "Quel est le message du commit ?",
                validate: function (value) {
                    const valid = value.length > 0;
                    return valid || "Veuillez entrer un message valide.";
                }
            },
            {
                type: "confirm",
                name: "push",
                message: "Voulez-vous pusher les modifications ?",
                default: false
            }
        ];

        const { message, push } = await inquirer.prompt(questions);

        const command = `git add . && git commit -m "${message}"`;

        // Exécuter la commande git add && git commit
        const gitAddCommit = spawn("sh", ["-c", command], { stdio: "inherit" });

        gitAddCommit.on("close", (code) => {
            if (code === 0) {
                console.log(chalk.green(`La commande git add && git commit s'est terminée avec succès.`));

                // Vérifier si on veut effectuer un git push
                if (push) {
                    const gitPush = spawn("git", ["push"], { stdio: "inherit" });
                    gitPush.on("close", (code) => {
                        if (code === 0) {
                            console.log(chalk.green("Git push effectué avec succès."));
                        } else {
                            console.error(chalk.red(`Le git push a échoué avec le code de sortie ${code}.`));
                        }
                        process.exit(code);
                    });
                } else {
                    process.exit(0);
                }
            } else {
                console.error(chalk.red(`La commande git add && git commit a échoué avec le code de sortie ${code}.`));
                process.exit(code);
            }
        });
       
    } catch (error) {
        console.error(chalk.red(`Erreur lors de l'exécution de la commande : ${error}`));
        process.exit(1);
    }  finally {
        process.exit(0);
    }
}

runCLI();