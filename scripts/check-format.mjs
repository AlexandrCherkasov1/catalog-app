import { getFormattedFiles, isFormatted } from "./format-utils.mjs";

const files = await getFormattedFiles();
const invalidFiles = [];

for (const file of files) {
  if (!(await isFormatted(file))) {
    invalidFiles.push(file);
  }
}

if (invalidFiles.length > 0) {
  console.error("Code style issues found:");
  for (const file of invalidFiles) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log("Code style check passed");