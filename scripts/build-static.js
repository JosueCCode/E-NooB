const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const frontendDir = path.join(root, "frontend");
const publicDir = path.join(root, "public");

fs.rmSync(publicDir, { recursive: true, force: true });
fs.mkdirSync(publicDir, { recursive: true });

for (const file of ["index.html", "styles.css", "script.js"]) {
  fs.copyFileSync(path.join(frontendDir, file), path.join(publicDir, file));
}

console.log("Static frontend copied to public/");
