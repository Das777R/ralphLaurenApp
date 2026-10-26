import { v2 as cloudinary } from "cloudinary";
import { configDotenv } from "dotenv";
import fs from "fs";

configDotenv();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// Cloudinary-safe folder segment: "Kids & Baby" -> "kids-and-baby"
export const toCloudinarySlug = (str = "") =>
  String(str)
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-zA-Z0-9 _-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();

export const uploadFilesToCloudinary = async (localFilePath, customFolderPath) => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: customFolderPath,
      resource_type: "auto",
    });

    return result.secure_url;
  } catch (err) {
    console.error(`Cloudinary upload failed for folder "${customFolderPath}":`, err.message);
    throw err;
  } finally {
    try {
      fs.unlinkSync(localFilePath);
    } catch (err) {
      console.error(`Failed to delete local file: ${err.message}`);
    }
  }
};