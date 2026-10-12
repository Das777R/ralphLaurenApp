import fs from 'fs';
import path from 'path';
import { HeaderNavs, HomeParts,Navs, Parts } from './constants.js';


export function createProductFolder(){
const products_path = path.join(process.cwd(), "Products");
fs.mkdirSync(products_path, {recursive: true});
  HeaderNavs.forEach((HeaderNav) => {
    const header_path = path.join(products_path, HeaderNav);
    fs.mkdirSync(header_path, {recursive: true});
  })
}

export function createMediaFolder() {
  const mediaPath = path.join(process.cwd(), "MediaForPage");
  fs.mkdirSync(mediaPath, { recursive: true });

  Navs.forEach((Nav) => {
    Parts.forEach((part) => {
    const page_path = path.join(mediaPath, Nav, part);
    fs.mkdirSync(page_path, {recursive: true});
    })
  })
}

export function createHomeMediaFolder() {
  const mediaPath = path.join(process.cwd(), "MediaForHome");

  HomeParts.forEach((HomePart) => {
    const home_path = path.join(mediaPath, HomePart);
    fs.mkdirSync(home_path, {recursive: true});
  })
}



