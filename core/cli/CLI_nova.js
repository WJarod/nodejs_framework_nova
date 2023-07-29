#!/usr/bin/env node

import { spawn } from "child_process";

const script = process.argv[2];

const scripts = {
    start: "./app.js",
    init: "./core/cli/CLI_init.js",
    model: "./core/cli/CLI_model.js",
    deploy: "./core/cli/CLI_deploy.js",
};

if (scripts[script]) {
    const child = spawn("node", [scripts[script]], { stdio: "inherit" });

    child.on("close", (code) => {
        process.exit(code);
    });
} else {
    console.log(`Unknown script "${script}".`);
    process.exit(1);
}
