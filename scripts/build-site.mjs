import { cpSync, existsSync, lstatSync, mkdirSync, readdirSync, realpathSync, rmdirSync, unlinkSync } from "node:fs";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = realpathSync(resolve(dirname(fileURLToPath(import.meta.url)), ".."));
const output = resolve(root, "_site");
const entries = ["index.html", "404.html", "robots.txt", "sitemap.xml", ".nojekyll", "Proof-R1", "XRAG"];

function checkTree(path) {
  const stat = lstatSync(path);
  if (stat.isSymbolicLink()) throw new Error(`Refusing a symlink in site files: ${path}`);
  if (stat.isDirectory()) {
    for (const name of readdirSync(path)) checkTree(resolve(path, name));
  }
}

// Validate all inputs and the generated directory before removing any output.
for (const entry of entries) checkTree(resolve(root, entry));
if (dirname(output) !== root || !output.startsWith(`${root}${sep}`)) throw new Error("Invalid build output directory.");
if (existsSync(output)) {
  if (realpathSync(output) !== output) throw new Error("Build output must not redirect outside the workspace.");
  checkTree(output);
}

function removeGenerated(path) {
  if (lstatSync(path).isDirectory()) {
    for (const name of readdirSync(path)) removeGenerated(resolve(path, name));
    rmdirSync(path);
  } else {
    unlinkSync(path);
  }
}

// Explicit file removal also works around recursive-rm bugs in older Windows Node releases.
if (existsSync(output)) removeGenerated(output);
mkdirSync(output);
for (const entry of entries) cpSync(resolve(root, entry), resolve(output, entry), { recursive: true });

await import("./validate-built-site.mjs");
console.log("Built the paper websites and root project links in _site/.");
