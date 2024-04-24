import chalk from "chalk";
import yargs from "yargs";
import clipboard from "clipboardy";
import { hideBin } from "yargs/helpers";

export type Config = Awaited<ReturnType<typeof parseArgvToConfig>>;

export const parseArgvToConfig = async () => {
  const argv = await yargs(hideBin(process.argv)).help(false).argv;

  return {
    name: String(argv.n || argv.name || "RootObject"),
    prefix: String(argv.p || argv.prefix || ""),
    kebab: Boolean(argv.k || argv.kebab),
    directory: Boolean(argv.d || argv.directory),
    clip: Boolean(argv.c || argv.clip),
    help: Boolean(argv.h || argv.help),
  };
};

export const kebabize = (input: string) =>
  input.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    (match, offset) => (offset ? "-" : "") + match.toLowerCase()
  );

export const readStream = async (stream: NodeJS.ReadStream) => {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
};

export const logError = (error: any) => {
  if (error instanceof Error) {
    console.error(chalk.red.bold(error.name), chalk.red(error.message));
  } else {
    console.error(chalk.red(error.toString()));
  }
};

export const logConfig = (config: Config) => {
  for (const [key, value] of Object.entries(config)) {
    const firstLetter = key[0];
    const rest = key.substring(1, key.length);

    console.log(
      chalk.grey(`  argv.${chalk.underline(firstLetter)}${rest}`),
      chalk.grey.bold(value)
    );
  }

  console.log();
};

export const logHelp = async (config: Config) => {
  console.log(chalk.green.bold("2ts"), chalk.green("- by idiidk"));
  logConfig(config);
};

export const readInput = async (config: Config): Promise<string> => {
  if (config.clip) {
    return await clipboard.read();
  }

  return await readStream(process.stdin);
};

export const formatFileName = (config: Config, name: string) => {
  if (config.kebab) {
    return kebabize(name);
  } else {
    return name;
  }
};

export const parseInterfaceName = (interfaceText: string) => {
  return interfaceText.split(" ")[0];
};

export const matchPropertyType = (needle: string, haystack: string) => {
  const lines = haystack.split("\n");

  for (const line of lines) {
    const type = line.split(": ")[1]?.split(";")[0] ?? "";
    const cleanType = type.replace(/\W/g, "");

    if (cleanType === needle) return true;
  }

  return false;
};
