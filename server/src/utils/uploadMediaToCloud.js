import {v2 as cloudinary} from 'cloudinary';
import { configDotenv } from 'dotenv';
import fs from 'fs';


configDotenv();


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});


export const uploadFilesToCloudinary = async (localFilePath, customFolderPath) => {
    try{
      const result = await cloudinary.uploader.upload(localFilePath,{
        folder: customFolderPath,
        resource_type: "auto" 
      });

   

      return result.secure_url;
    }catch(err){
      console.error(`Cloudinary Upload has Failed, ${err.message}` )
      console.error("Cloudinary Upload has Failed:", err);
      console.error("Full error detail:", JSON.stringify(err, null, 2));
      throw err;
    } finally {
      try{
        await fs.unlinkSync(localFilePath);
      }catch(err){
        console.error(`Files failed to unnlnk from local storage, ${err.message}`);
      }
    }
}




