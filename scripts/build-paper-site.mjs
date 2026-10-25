import { cpSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { dirname, extname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

// An explicit publish list keeps the retained personal website out of GitHub Pages.
const root = realpathSync(resolve(dirname(fileURLToPath(import.meta.url)), ".."));
const destination = resolve(root, "_site");
const requiredPages = ["index.html", "404.html", "robots.txt", "sitemap.xml"];
const projectDirectory = "Proof-R1";
const files = [];

function assertInsideRoot(path) {
  const local = relative(root, path);
  if (!local || local === ".." || local.startsWith(`..${sep}`) || isAbsolute(local)) {
    throw new Error(`Refusing a path outside the project: ${path}`);
  }
}

function collect(path) {
  assertInsideRoot(path);
  const stat = lstatSync(path);
  if (stat.isSymbolicLink()) throw new Error(`Publish sources must not be symbolic links: ${path}`);
  if (stat.isDirectory()) {
    for (const name of readdirSync(path)) {
      if (!name.startsWith(".")) collect(resolve(path, name));
    }
  } else if (stat.isFile()) {
    files.push(relative(root, path).split(sep).join("/"));
  }
}

for (const page of requiredPages) collect(resolve(root, page));
collect(resolve(root, projectDirectory));
if (!files.includes(`${projectDirectory}/index.html`)) throw new Error("The Proof-R1 homepage is missing.");
if (!files.some((file) => file.startsWith(`${projectDirectory}/assets/`))) throw new Error("No paper assets were found.");

const publishFiles = new Set(files);
const htmlIds = new Map();
for (const file of files.filter((file) => extname(file) === ".html")) {
  const html = readFileSync(resolve(root, file), "utf8");
  if (/\{%|\{\{/.test(html)) throw new Error(`Unrendered Liquid in static page: ${file}`);
  htmlIds.set(file, new Set([...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map((match) => match[1])));
}

function checkReference(from, reference) {
  if (!reference || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference)) return;
  const base = new URL(from, "https://paper.local/");
  const url = new URL(reference.replaceAll("&amp;", "&"), base);
  let target = decodeURIComponent(url.pathname).replace(/^\//, "");
  if (!target || target.endsWith("/")) target += "index.html";
  if (!publishFiles.has(target)) throw new Error(`Unpublished local link in ${from}: ${reference}`);
  if (url.hash && htmlIds.has(target) && !htmlIds.get(target).has(decodeURIComponent(url.hash.slice(1)))) {
    throw new Error(`Missing anchor in ${from}: ${reference}`);
  }
}

for (const file of files) {
  if (extname(file) === ".html") {
    const html = readFileSync(resolve(root, file), "utf8");
    for (const match of html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']*)["']/g)) checkReference(file, match[1]);
  }
  if (extname(file) === ".css") {
    const css = readFileSync(resolve(root, file), "utf8");
    for (const match of css.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/g)) checkReference(file, match[1]);
  }
}

// Validate everything before replacing the generated output, and never follow a symlink.
assertInsideRoot(destination);
if (existsSync(destination)) {
  if (lstatSync(destination).isSymbolicLink() || realpathSync(destination) !== destination) {
    throw new Error(`Refusing to clean a redirected output directory: ${destination}`);
  }
  rmSync(destination, { recursive: true });
  if (existsSync(destination)) {
    throw new Error("The output directory could not be removed. Use a current Node.js runtime, then rebuild.");
  }
}
mkdirSync(destination, { recursive: true });
for (const file of files) {
  const target = resolve(destination, file);
  mkdirSync(dirname(target), { recursive: true });
  cpSync(resolve(root, file), target);
}
writeFileSync(resolve(destination, ".nojekyll"), "");
console.log(`Built ${files.length} source files and .nojekyll. Paper homepage: /Proof-R1/.`);
console.log("The root landing page is independent; personal website sources remain excluded from publication.");
