// utils/memeHelpers.js
import path from "path";
import fs from "fs";

export function getMemes() {
  const memesDir = path.join(process.cwd(), "public/memes");
  return fs.readdirSync(memesDir)
    .sort((a, b) => {
      return fs.statSync(path.join(memesDir, b)).ctimeMs - fs.statSync(path.join(memesDir, a)).ctimeMs;
    })
    .map(filename => ({
      filename,
      name: formatName(filename),
      type: getType(filename),
    }));
}

function formatName(filename) {
  const name = filename.replace(/\.[^/.]+$/, "");
  return name.replace(/[-_]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

function getType(filename) {
  return filename.toLowerCase().endsWith(".gif") ? "animated" : "static";
}
