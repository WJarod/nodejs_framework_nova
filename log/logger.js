import fs from "fs";
import chalk from "chalk";

export const logToFile = (message, isError = false) => {
  const logMessage = `${new Date().toISOString()} - ${message}\n`;

  // Utiliser la couleur appropriée en fonction du type de message
  const logColor = isError ? chalk.red : chalk.green;

  // Écrire le message de log coloré dans le fichier
  fs.appendFile("server.log", logColor(logMessage), (err) => {
    if (err) {
      console.error("Erreur lors de l'écriture du log :", err);
    }
  });
};