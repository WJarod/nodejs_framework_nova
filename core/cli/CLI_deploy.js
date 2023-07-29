// Importation des modules nécessaires
import inquirer from "inquirer";
import fs from "fs/promises";
import dotenv from "dotenv";

// Fonction pour exécuter l'interface de ligne de commande
async function runCLI() {
    dotenv.config();
    try {
        const questions = [
            {
                type: "confirm",
                name: "docker",
                message: "Voulez-vous utiliser Docker ? (y/n)",
                default: false,
            }];

        const { docker } = await inquirer.prompt(questions);

        if (docker) {
            const dockerfile = `FROM node:14-alpine
ENV DATABASE_URL=${process.env.DATABASE_URL}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE ${process.env.PORT}
CMD [ "npm", "start" ]`;
            await fs.writeFile("Dockerfile", dockerfile);
        }

       // await fs.rmdir("core/cli", { recursive: true });

        console.log("Le projet est prêt !");

    } catch (error) {
        console.error(`Error while creating Dockerfile : ${error}`);
    }
    finally {
        process.exit(0);
    }
}

runCLI();