import multer from "multer";
import fs from "fs";
import path from "path";
import { createProductFolder } from "../createFolderForMedia.js";

export const productPath = path.join(process.cwd(), "Products");


const storageForProduct = multer.diskStorage({
  destination: (req, file, cb) => {
    createProductFolder();
    cb(null, productPath);
  },

  filename: (req, file, cb) => {
    const fileName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + "-" + file.originalname;
    cb(null, fileName);
  },
});

export const uploadProduct = multer({ storage: storageForProduct });

export const uploadFields = uploadProduct.fields([
  { name: "slideImage", maxCount: 10 },
  { name: "lookImage", maxCount: 1 },
  { name: "colorImage", maxCount: 1 },
]);