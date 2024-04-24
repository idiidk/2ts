#!/usr/bin/env node

import chalk from "chalk";
import { json2ts } from "json-ts";
import { randomUUID } from "crypto";
import {
  matchPropertyType,
  formatFileName,
  logConfig,
  logError,
  parseArgvToConfig,
  parseInterfaceName,
  readInput,
  logHelp,
} from "./utils.mjs";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const main = async () => {
  // parse argv from stdin
  const config = await parseArgvToConfig();

  if (config.help) {
    await logHelp(config);
    return;
  }

  // read input from stdin and checking if valid json
  const input = await readInput(config);
  JSON.parse(input);

  console.log(chalk.green("generating"), chalk.green.bold(config.name));
  logConfig(config);

  // generate interfaces with unique prefix (uuid)
  const uuid = randomUUID().split("-").join("").toUpperCase();
  const gen = json2ts(input, {
    prefix: `${uuid}${config.prefix}`,
    rootName: config.name,
  });

  // split all interface declerations into an array and clean them up
  // removing uuid's from imports, etc
  const interfaces = gen
    .split(`interface ${uuid}`)
    .filter((e) => !!e)
    .map((e) => e.split(uuid).join(""))
    .map((e) => e.trim());

  // use as backreference for imports
  const interfaceNames = interfaces.map(parseInterfaceName);

  // if directory option set, create directory
  const rootNameFormatted = formatFileName(config, `${config.prefix}${config.name}`);
  if (config.directory) {
    await mkdir(rootNameFormatted);
  }

  // loop over all interfaces to generate code
  for (const interfaceText of interfaces) {
    const buffer = [];

    const interfaceName = parseInterfaceName(interfaceText);

    // filter out which imports are needed based on the value of the properties
    const imports = interfaceNames
      .filter((e) => e !== interfaceName)
      .filter((e) => matchPropertyType(e, interfaceText))
      .map((e) => `import { ${e} } from "./${formatFileName(config, e)}"`);

    // add the import statements to the buffer
    buffer.push(...imports);

    // add new line after imports
    imports.length > 0 && buffer.push("");

    // add the interface to the buffer
    buffer.push(`export interface ${interfaceText}`);

    // write the buffer
    const interfaceFileName = formatFileName(config, interfaceName);
    await writeFile(
      path.join(
        process.cwd(),
        config.directory ? `./${rootNameFormatted}/` : "",
        `${interfaceFileName}.ts`
      ),
      buffer.join("\n"),
      "utf-8"
    );

    console.log(chalk.green(`+ ${interfaceFileName}.ts`));
  }
};

main().catch(logError);
