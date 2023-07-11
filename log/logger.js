// Importation des modules nécessaires
import fs from "fs";
import chalk from "chalk";

// Fonction pour écrire un message dans un fichier de logs
export const logToFile = (message, isError = false) => {
  // Préparation du message de log
  const logMessage = `${new Date().toISOString()} - ${message}\n`;

  // Détermination de la couleur du message en fonction du type de message
  const logColor = isError ? chalk.red : chalk.green;

  // Écriture du message de log coloré dans le fichier de logs
  fs.appendFile("server.log", logColor(logMessage), (err) => {
    if (err) {
      console.error("Erreur lors de l'écriture du log :", err);
    }
  });
};
