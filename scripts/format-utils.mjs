import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import prettier from "prettier";

const ignoredDirectories = new Set([
  ".git",
  ".next",
  "build",
  "coverage",
  "node_modules",
  "out",
]);

const supportedExtensions = new Set([
  ".css",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".scss",
  ".ts",
  ".tsx",
]);

const supportedFiles = new Set([
  ".gitignore",
  ".prettierignore",
  ".prettierrc",
]);

export async function getFormattedFiles(directory = process.cwd()) {
  const files = [];
  await collectFiles(directory, files);
  return files;
}

export async function formatFile(filePath) {
  const input = await readFile(filePath, "utf8");
  const options = await prettier.resolveConfig(filePath);
  const formatted = await prettier.format(input, {
    ...options,
    filepath: filePath,
  });

  return trimFinalLineBreak(formatted);
}

export async function writeFormattedFile(filePath) {
  const formatted = await formatFile(filePath);
  await writeFile(filePath, formatted);
}

export async function isFormatted(filePath) {
  const input = await readFile(filePath, "utf8");
  const formatted = await formatFile(filePath);
  return input === formatted;
}

function trimFinalLineBreak(value) {
  return value.replace(/[\r\n]+$/u, "");
}

async function collectFiles(directory, files) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        await collectFiles(entryPath, files);
      }

      continue;
    }

    if (await shouldFormat(entryPath)) {
      files.push(entryPath);
    }
  }
}

async function shouldFormat(filePath) {
  const basename = path.basename(filePath);
  const extension = path.extname(filePath);

  if (!supportedFiles.has(basename) && !supportedExtensions.has(extension)) {
    return false;
  }

  const fileInfo = await prettier.getFileInfo(filePath, {
    ignorePath: path.join(process.cwd(), ".prettierignore"),
  });

  return !fileInfo.ignored && Boolean(fileInfo.inferredParser);
}