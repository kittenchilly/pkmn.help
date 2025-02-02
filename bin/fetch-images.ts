import fs from "fs";
import fetch from "node-fetch";
import path from "path";
import { readJSON, saveJSON } from "./util";

const SRC = path.resolve(__dirname, "../data/merged-pokemon.json");
const IMG_DEST = path.resolve(__dirname, "../public/img");
const DATA_DEST = path.resolve(__dirname, "../public/data-pkmn.json");

async function fetchBuffer(url: string): Promise<Buffer> {
  const resp = await fetch(url);
  return await resp.buffer();
}

async function main(): Promise<void> {
  const list = readJSON(SRC);
  for (const item of list) {
    const imgFilename = path.resolve(IMG_DEST, `${item.id}.png`);
    if (item.spriteURL && !fs.existsSync(imgFilename)) {
      const img = await fetchBuffer(item.spriteURL);
      fs.writeFileSync(imgFilename, img);
    }
    delete item.spriteURL;
    const shinyImgFilename = path.resolve(IMG_DEST, `${item.id}-shiny.png`);
    if (item.shinySpriteURL && !fs.existsSync(shinyImgFilename)) {
      const img = await fetchBuffer(item.shinySpriteURL);
      fs.writeFileSync(shinyImgFilename, img);
    }
    item.hasShiny = Boolean(item.shinySpriteURL);
    delete item.shinySpriteURL;
  }
  saveJSON(DATA_DEST, list);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});