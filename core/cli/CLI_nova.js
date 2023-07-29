#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { spawn } from "child_process";
import chalk from "chalk";
import boxen from "boxen";

const scripts = {
    start: "./app.js",
    init: "./core/cli/CLI_init.js",
    model: "./core/cli/CLI_model.js",
    deploy: "./core/cli/CLI_deploy.js",
};

const usage = boxen(
    chalk.bold("Usage: nova <command> [options]"),
    {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "green",
    }
);

yargs(hideBin(process.argv))
    .usage(usage)
    .command(
        "start",
        "Start the server",
        () => {
            const child = spawn("node", [scripts.start], { stdio: "inherit" });

            child.on("close", (code) => {
                process.exit(code);
            });
        }
    )
    .command(
        "init",
        "Initialize a new project",
        () => {
            const child = spawn("node", [scripts.init], { stdio: "inherit" });

            child.on("close", (code) => {
                process.exit(code);
            });
        }
    )
    .command(
        "model",
        "Generate a new model",
        () => {
            const child = spawn("node", [scripts.model], { stdio: "inherit" });

            child.on("close", (code) => {
                process.exit(code);
            });
        }
    )
    .command(
        "deploy",
        "Deploy the server",
        () => {
            const child = spawn("node", [scripts.deploy], { stdio: "inherit" });

            child.on("close", (code) => {
                process.exit(code);
            });
        }
    )
    .demandCommand(1, "")
    .help(
        "help",
        "Show help"
    )
    .version(
        "version",
        "Show version number",
        "0.0.1"
    )
    .argv;