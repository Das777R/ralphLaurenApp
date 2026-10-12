import multer from "multer";
import fs, { mkdirSync } from 'fs'
import path from "path";
import {createHomeMediaFolder, createMediaFolder} from "../createFolderForMedia.js";


const mediaPath = path.join(process.cwd(), "MediaForPage");
const homeMediaPath = path.join(process.cwd(), "MediaForHome");


const storageForWeb = multer.diskStorage({

destination: (req,file,cb) => {
  const {nav, part} = req.params;
  
  let target_path = path.join(mediaPath,nav,part);

    createMediaFolder();

    if(!fs.existsSync(target_path)){
    fs.mkdirSync(target_path, {recursive: true});
    }

    cb(null, target_path);
},
filename: (req,file,cb) => {
  const fileName = Date.now() + "-" + file.originalname; 
  cb(null, fileName);
  }
})

export  const uploadMediaForWeb = multer({storage: storageForWeb}); 


const storageForHomePage = multer.diskStorage({
destination: (req,file,cb) => {
const {section} = req.params;
let target_path = path.join(`${homeMediaPath}/${section}`);

createHomeMediaFolder();

if(!fs.existsSync(target_path)){
  fs.mkdirSync(target_path, {recursive: true});
}

cb(null, target_path);

},

filename: (req,file,cb) =>  {
  const fileName = Date.now() + "-" + file.originalname; 
  cb(null, fileName);
  }
})

export const mediaForHome = multer({storage: storageForHomePage});
