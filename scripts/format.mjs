import { getFormattedFiles, writeFormattedFile } from "./format-utils.mjs";

const files = await getFormattedFiles();

await Promise.all(files.map((file) => writeFormattedFile(file)));