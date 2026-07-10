import { rmSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import ts from "typescript";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const buildDir = join(rootDir, ".test-build");
const sourceFiles = [
  "src/entities/product/lib/get-product-price.ts",
  "src/entities/product/lib/catalog.ts",
  "src/entities/product/model/cart-slice.ts",
  "src/entities/product/model/favorites-slice.ts",
  "src/entities/product/model/selectors.ts",
];

rmSync(buildDir, {
  force: true,
  recursive: true,
});

for (const sourceFile of sourceFiles) {
  const sourcePath = join(rootDir, sourceFile);
  const outputPath = join(buildDir, sourceFile).replace(/\.ts$/, ".js");
  const source = readFileSync(sourcePath, "utf8");
  const result = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: sourcePath,
  });

  mkdirSync(dirname(outputPath), {
    recursive: true,
  });
  writeFileSync(outputPath, result.outputText);
}

const testRun = spawnSync(
  process.execPath,
  ["--test", "tests/store-and-catalog.test.cjs"],
  {
    cwd: rootDir,
    stdio: "inherit",
  },
);

rmSync(buildDir, {
  force: true,
  recursive: true,
});

process.exit(testRun.status ?? 1);