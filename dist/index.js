#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_yargs = __toESM(require("yargs"));
var import_helpers = require("yargs/helpers");

// src/api.ts
var HumanizeRaiAPI = class {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.apiUrl = config.apiUrl || "https://humanizerai.com/api/v1";
  }
  async request(endpoint, options = {}) {
    const url = `${this.apiUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
      ...options.headers
    };
    const response = await fetch(url, {
      ...options,
      headers
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
      const msg = error.message || `API Error (${response.status})`;
      throw new Error(msg);
    }
    return await response.json();
  }
  async detect(text) {
    return this.request("/detect", {
      method: "POST",
      body: JSON.stringify({ text })
    });
  }
  async humanize(text, intensity = "medium") {
    return this.request("/humanize", {
      method: "POST",
      body: JSON.stringify({ text, intensity })
    });
  }
  async credits() {
    return this.request("/credits", {
      method: "GET"
    });
  }
};

// src/config.ts
function getApi() {
  const apiKey = process.env.HUMANIZERAI_API_KEY;
  if (!apiKey) {
    console.error("Error: HUMANIZERAI_API_KEY is not set.");
    console.error("");
    console.error("Set it with:");
    console.error("  export HUMANIZERAI_API_KEY=hum_your_api_key");
    console.error("");
    console.error("Get your API key at https://humanizerai.com/dashboard");
    process.exit(1);
  }
  const apiUrl = process.env.HUMANIZERAI_API_URL;
  return new HumanizeRaiAPI({ apiKey, apiUrl });
}

// src/commands/detect.ts
async function detectCommand(argv) {
  const api = getApi();
  let text;
  if (argv.file) {
    const fs = await import("fs");
    text = fs.readFileSync(argv.file, "utf-8");
  } else if (argv.text) {
    text = Array.isArray(argv.text) ? argv.text.join(" ") : argv.text;
  } else {
    const chunks = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
    text = Buffer.concat(chunks).toString("utf-8");
  }
  if (!text || !text.trim()) {
    console.error('Error: No text provided. Use -t "text", -f file.txt, or pipe from stdin.');
    process.exit(1);
  }
  try {
    const result = await api.detect(text.trim());
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(JSON.stringify({ error: error.message }, null, 2));
    process.exit(1);
  }
}

// src/commands/humanize.ts
async function humanizeCommand(argv) {
  const api = getApi();
  let text;
  if (argv.file) {
    const fs = await import("fs");
    text = fs.readFileSync(argv.file, "utf-8");
  } else if (argv.text) {
    text = Array.isArray(argv.text) ? argv.text.join(" ") : argv.text;
  } else {
    const chunks = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
    text = Buffer.concat(chunks).toString("utf-8");
  }
  if (!text || !text.trim()) {
    console.error('Error: No text provided. Use -t "text", -f file.txt, or pipe from stdin.');
    process.exit(1);
  }
  const intensity = argv.intensity || "medium";
  try {
    const result = await api.humanize(text.trim(), intensity);
    if (argv.raw) {
      process.stdout.write(result.humanizedText);
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error(JSON.stringify({ error: error.message }, null, 2));
    process.exit(1);
  }
}

// src/commands/credits.ts
async function creditsCommand() {
  const api = getApi();
  try {
    const result = await api.credits();
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(JSON.stringify({ error: error.message }, null, 2));
    process.exit(1);
  }
}

// src/index.ts
(0, import_yargs.default)((0, import_helpers.hideBin)(process.argv)).scriptName("humanizerai").usage("$0 <command> [options]").command(
  "detect",
  "Detect AI-generated text (free, no credits used)",
  (yargs2) => {
    return yargs2.option("text", {
      alias: "t",
      describe: "Text to analyze",
      type: "string"
    }).option("file", {
      alias: "f",
      describe: "Path to text file to analyze",
      type: "string"
    }).example('$0 detect -t "Your text here"', "Detect AI in inline text").example("$0 detect -f essay.txt", "Detect AI in a file").example('echo "text" | $0 detect', "Pipe text from stdin");
  },
  detectCommand
).command(
  "humanize",
  "Humanize AI-generated text (uses credits: 1 word = 1 credit)",
  (yargs2) => {
    return yargs2.option("text", {
      alias: "t",
      describe: "Text to humanize",
      type: "string"
    }).option("file", {
      alias: "f",
      describe: "Path to text file to humanize",
      type: "string"
    }).option("intensity", {
      alias: "i",
      describe: "Humanization intensity",
      type: "string",
      choices: ["light", "medium", "aggressive"],
      default: "medium"
    }).option("raw", {
      alias: "r",
      describe: "Output only the humanized text (for piping)",
      type: "boolean",
      default: false
    }).example('$0 humanize -t "Your AI text"', "Humanize with medium intensity").example('$0 humanize -t "Text" -i aggressive', "Humanize with max bypass").example("$0 humanize -f draft.txt -r > final.txt", "Humanize file and save output").example('echo "AI text" | $0 humanize -r', "Pipe in and get clean output");
  },
  humanizeCommand
).command(
  "credits",
  "Check credit balance and plan status",
  {},
  creditsCommand
).demandCommand(1, "You need at least one command").help().alias("h", "help").version().alias("v", "version").epilogue(
  "For more information, visit: https://humanizerai.com\n\nSet your API key: export HUMANIZERAI_API_KEY=hum_your_key\n\nDiscover more AI agent skills at https://agentskill.sh"
).parse();
//# sourceMappingURL=index.js.map