import chalk from "chalk";
import { Command } from "commander";
import { resolve } from "path";
import { join } from "node:path";
import { readdirSync, statSync } from "fs";
import { Count, Options } from "./types.js";

const { target, depth } = new Command()
  .requiredOption("--target <char>")
  .requiredOption("--depth <char>")
  .parse()
  .opts<{ target: string; depth: string }>();

const TARGET_DIRECTORY = resolve(target);
const DEPTH = resolve(depth);
const DEFAULT_DEPTH = 2;
const SPACING = "    ";
const BRANCH = "│   ";

async function main() {
  console.log(chalk.blue(`Input path: ${TARGET_DIRECTORY}`));
  console.time("Total processing time");

  const count: Count = { directories: 0, files: 0 };

  displayTree(TARGET_DIRECTORY, 0, { depth: Number(DEPTH) || DEFAULT_DEPTH }, count);

  console.log(chalk.green("Total directories:", count.directories));
  console.log(chalk.green("Total files:", count.files));

  console.timeEnd("Total processing time");
}


function displayTree(currentPath: string, currentDepth: number, options: Options, directoryFileCount: Count, parentPrefix: string = ""): void {
  const { depth = Infinity } = options;
  const files = readDirectory(currentPath);

  files.forEach((file: string, fileIndex: number) => {
    const filePath = join(currentPath, file);
    handleFile(file, filePath, currentDepth, depth, options, directoryFileCount, parentPrefix, fileIndex, files.length);
  });
}

function readDirectory(directoryPath: string): string[] {
  try {
    return readdirSync(directoryPath);
  } catch (error) {
    console.error(`Error reading directory: ${directoryPath}`, error);
    return [];
  }
}

function handleFile(file: string, filePath: string, currentDepth: number, depth: number, options: Options, directoryFileCount: Count, parentPrefix: string, fileIndex: number, totalFiles: number): void {
  const stats = statSync(filePath);
  const isLastFile = fileIndex === totalFiles - 1;
  const prefix = isLastFile ? "└── " : "├── ";
  const displayFile = stats.isDirectory() ? `[${file}]` : file;
  console.log(`${parentPrefix}${prefix}${displayFile}`);

  if (stats.isDirectory() && currentDepth < depth) {
    directoryFileCount.directories++;
    const newPrefix = isLastFile ? parentPrefix + SPACING : parentPrefix + BRANCH;
    displayTree(filePath, currentDepth + 1, options, directoryFileCount, newPrefix);
  } else {
    directoryFileCount.files++;
  }
}

main();