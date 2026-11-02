import { existsSync, lstatSync, readFileSync, readdirSync, realpathSync } from "node:fs";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = realpathSync(resolve(dirname(fileURLToPath(import.meta.url)), ".."));
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== "--directory")) {
  throw new Error("Usage: node scripts/validate-built-site.mjs [--directory <built-site>]");
}
const directory = resolve(root, args[1] || "_site");
if (!existsSync(directory) || !lstatSync(directory).isDirectory()) {
  throw new Error("Run npm run build before validating the site.");
}

function collect(path, base) {
  const stat = lstatSync(path);
  if (stat.isSymbolicLink()) throw new Error(`Unexpected symlink in site files: ${path}`);
  if (!stat.isDirectory()) return [relative(base, path).split(sep).join("/")];
  return readdirSync(path).flatMap((name) => collect(resolve(path, name), base));
}

const published = new Set(collect(directory, directory));
const rootFiles = ["index.html", "404.html", "robots.txt", "sitemap.xml", ".nojekyll"];
const homepageFiles = collect(resolve(root, "homepage"), root);
for (const file of ["homepage/style.css", "homepage/script.js", "homepage/portrait.jpg", "homepage/favicon.svg"]) {
  if (!homepageFiles.includes(file)) throw new Error(`Missing required homepage source asset: ${file}`);
}
const paperFiles = ["Proof-R1", "XRAG"].flatMap((project) => collect(resolve(root, project), root));
const expected = new Set([...rootFiles, ...homepageFiles, ...paperFiles]);
for (const file of expected) {
  if (!published.has(file)) throw new Error(`Missing published page or asset: ${file}`);
  if (!readFileSync(resolve(root, file)).equals(readFileSync(resolve(directory, file)))) {
    throw new Error(`Published file changed during the build: ${file}`);
  }
}
for (const file of published) {
  if (!expected.has(file)) throw new Error(`File outside the publication allowlist: ${file}`);
}
const home = readFileSync(resolve(directory, "index.html"), "utf8");
if (!home.includes('href="/Proof-R1/"') || !home.includes('href="/XRAG/"')) {
  throw new Error("The root page must link to both paper websites.");
}

const pageIds = new Map();
function openingTags(html) {
  // Embedded JavaScript can contain HTML-like strings that are not page links.
  const markup = html.replace(/<!--[\s\S]*?-->/g, "").replace(/(<(script|style|textarea)\b[^>]*>)[\s\S]*?<\/\2\s*>/gi, "$1</$2>");
  return [...markup.matchAll(/<[a-z](?:[^"'<>]|"[^"]*"|'[^']*')*>/gi)].map((match) => match[0]).join("\n");
}

for (const file of [...published].filter((file) => extname(file) === ".html")) {
  const html = readFileSync(resolve(directory, file), "utf8");
  // Code samples such as BibTeX titles can legitimately contain literal {{...}}.
  const renderedContent = html.replace(/<(pre|code)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "");
  if (/\{%|\{\{/.test(renderedContent)) throw new Error(`Unrendered Liquid in page: ${file}`);
  pageIds.set(file, new Set([...openingTags(html).matchAll(/\sid\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1])));
}

function checkReference(from, reference) {
  if (!reference || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference)) return;
  const url = new URL(reference.replaceAll("&amp;", "&"), new URL(from, "https://site.local/"));
  let target = decodeURIComponent(url.pathname).replace(/^\//, "");
  if (!target || target.endsWith("/")) target += "index.html";
  if (!published.has(target)) throw new Error(`Missing local reference in ${from}: ${reference}`);
  if (url.hash && pageIds.has(target) && !pageIds.get(target).has(decodeURIComponent(url.hash.slice(1)))) {
    throw new Error(`Missing anchor in ${from}: ${reference}`);
  }
  return target;
}

const stylesheets = new Set();
for (const file of published) {
  if (extname(file) === ".html") {
    const html = openingTags(readFileSync(resolve(directory, file), "utf8"));
    for (const match of html.matchAll(/\s(?:href|src)\s*=\s*["']([^"']*)["']/gi)) {
      const target = checkReference(file, match[1]);
      if (target && extname(target) === ".css") stylesheets.add(target);
    }
  }
}
// Follow stylesheets used by published pages, including nested CSS imports.
for (const file of stylesheets) {
  const css = readFileSync(resolve(directory, file), "utf8");
  for (const match of css.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/g)) {
    const target = checkReference(file, match[1]);
    if (target && extname(target) === ".css") stylesheets.add(target);
  }
}

const sitemap = readFileSync(resolve(directory, "sitemap.xml"), "utf8");
for (const path of ["/", "/Proof-R1/", "/Proof-R1/blog.html", "/XRAG/", "/XRAG/blog.html"]) {
  if (!sitemap.includes(`<loc>https://xiaolizhang77.github.io${path}</loc>`)) {
    throw new Error(`Missing canonical page in sitemap: ${path}`);
  }
}
console.log(
  `Validated ${pageIds.size} HTML pages, ${homepageFiles.length} homepage assets, and ${paperFiles.length} unchanged paper-site files; no profile source or retired template files were published.`
);
